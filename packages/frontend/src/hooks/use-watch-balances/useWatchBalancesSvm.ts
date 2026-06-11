import type { UsdPricedErc20Token } from "@metrom-xyz/sdk";
import { useEffect, useMemo, useState } from "react";
import type {
    Erc20TokenWithBalance,
    UseWatchBalancesParams,
    UseWatchBalancesReturnValue,
} from ".";
import { formatUnits } from "@/src/utils/format";
import { useSolanaClient } from "@solana/react-hooks";
import type { ClientWatchers } from "@solana/client";
import { getBase64Encoder } from "@solana/kit";
import { getTokenDecoder } from "@solana-program/token";

const collator = new Intl.Collator();
const base64Encoder = getBase64Encoder();
const tokenDecoder = getTokenDecoder();

export function useWatchBalancesSvm<T extends UsdPricedErc20Token>({
    chainId,
    address,
    tokens,
    enabled = true,
}: UseWatchBalancesParams<T> = {}): UseWatchBalancesReturnValue<T> {
    const client = useSolanaClient();
    const [rawBalances, setRawBalances] = useState<bigint[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !tokens?.length || !address || !chainId) {
            setRawBalances([]);
            return;
        }

        let cancelled = false;
        let subscriptions: ReturnType<ClientWatchers["watchAccount"]>[] = [];

        setRawBalances([]);
        setLoading(true);

        const exec = async () => {
            const ataAddresses = await Promise.all(
                tokens.map((token) =>
                    client
                        .splToken({ mint: token.address })
                        .deriveAssociatedTokenAddress(address),
                ),
            );

            if (cancelled) return;

            try {
                const { value: accounts } = await client.runtime.rpc
                    .getMultipleAccounts(ataAddresses, { encoding: "base64" })
                    .send();

                if (!cancelled) {
                    const balances = accounts.map((account) =>
                        account
                            ? tokenDecoder.decode(
                                  base64Encoder.encode(account.data[0]),
                              ).amount
                            : 0n,
                    );

                    setRawBalances(balances);
                }
            } catch (error) {
                console.error(
                    `Could not fetch balances for Solana tokens: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }

            if (cancelled) return;

            const results = await Promise.allSettled(
                ataAddresses.map((ataAddress, i) =>
                    client.watchers.watchAccount(
                        { address: ataAddress },
                        async () => {
                            if (cancelled) return;
                            try {
                                const balance = await client
                                    .splToken({ mint: tokens[i].address })
                                    .fetchBalance(address);
                                if (cancelled) return;
                                setRawBalances((prev) => {
                                    const next = [...prev];
                                    next[i] = balance.amount;
                                    return next;
                                });
                            } catch (error) {
                                console.error(
                                    `Could not refetch balance for ${tokens[i].symbol}: ${error}`,
                                );
                            }
                        },
                    ),
                ),
            );

            if (!cancelled) {
                subscriptions = results
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value);
            }
        };

        exec();

        return () => {
            cancelled = true;
            subscriptions.forEach((sub) => sub.abort());
        };
    }, [enabled, chainId, address, tokens, client]);

    const tokensWithBalance = useMemo(() => {
        if (!tokens) return [];

        if (rawBalances.length !== tokens.length)
            return tokens.map((token) => ({ token, balance: null }));

        return tokens.reduce(
            (accumulator: Erc20TokenWithBalance<T>[], token, i) => {
                const raw = rawBalances[i];
                accumulator.push({
                    token,
                    balance: {
                        raw,
                        formatted: Number(formatUnits(raw, token.decimals)),
                    },
                });
                return accumulator;
            },
            [],
        );
    }, [rawBalances, tokens]);

    const sortedTokensWithBalance = [...tokensWithBalance].sort((a, b) => {
        if (!a.balance && !b.balance)
            return collator.compare(
                a.token.symbol.toLowerCase(),
                b.token.symbol.toLowerCase(),
            );

        if (!a.balance) return 1;
        if (!b.balance) return -1;

        const aUsdAmount = a.balance.formatted * a.token.usdPrice;
        const bUsdAmount = b.balance.formatted * b.token.usdPrice;
        return bUsdAmount - aUsdAmount;
    });

    return { tokensWithBalance: sortedTokensWithBalance, loading };
}

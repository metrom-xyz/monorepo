import type { UsdPricedErc20Token } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import type {
    Erc20TokenWithBalance,
    UseWatchBalancesParams,
    UseWatchBalancesReturnValue,
} from ".";
import { useQuery } from "@tanstack/react-query";
import { type Address, formatUnits } from "viem";
import { useClients } from "@aptos-labs/react";
import { useWatchBlockNumber } from "../use-watch-block-number";
import { chainIdToAptosNetwork } from "@/src/utils/chain";

const collator = new Intl.Collator();

export function useWatchBalancesMvm<T extends UsdPricedErc20Token>({
    chainId,
    address,
    tokens,
    enabled = true,
}: UseWatchBalancesParams<T> = {}): UseWatchBalancesReturnValue<T> {
    const blockNumber = useWatchBlockNumber();
    const { client } = useClients();

    const { data: rewardTokenRawBalances, isLoading: loading } = useQuery({
        queryKey: [
            "watch-whitelisted-tokens-balances",
            blockNumber,
            chainId,
            tokens,
            address,
        ],
        queryFn: async ({ queryKey }) => {
            const [, , chainId, tokens, address] = queryKey as [
                string,
                number | undefined,
                number | undefined,
                T[] | undefined,
                Address | undefined,
            ];

            if (!chainId || !tokens || !address) return null;

            const network = chainIdToAptosNetwork(chainId);
            if (!network) return null;

            try {
                return await Promise.all(
                    tokens.map((token) =>
                        client.fetchBalance({
                            address,
                            network: {
                                // FIXME: fix type
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                network: network as any,
                            },
                            asset: token.address,
                        }),
                    ),
                );
            } catch (error) {
                console.error(
                    `Could not fetch balances for whitelisted tokens: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!tokens && !!address && enabled,
    });

    const tokensWithBalance = useMemo(() => {
        if (!tokens) return [];

        if (
            !rewardTokenRawBalances ||
            rewardTokenRawBalances.length !== tokens.length
        )
            return tokens.map((token) => {
                return {
                    token,
                    balance: null,
                };
            });

        return tokens.reduce(
            (accumulator: Erc20TokenWithBalance<T>[], token, i) => {
                let balance = null;

                const rawBalance = rewardTokenRawBalances[i];
                const formattedBalance = Number(
                    formatUnits(rawBalance, token.decimals),
                );
                balance = {
                    raw: rawBalance,
                    formatted: formattedBalance,
                };

                accumulator.push({
                    token,
                    balance,
                });

                return accumulator;
            },
            [],
        );
    }, [rewardTokenRawBalances, tokens]);

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

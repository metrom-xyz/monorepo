import type { UsdPricedErc20Token } from "@metrom-xyz/sdk";
import { useEffect, useMemo } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useReadContracts } from "wagmi";
import { useWatchBlockNumber } from "../use-watch-block-number";
import type {
    Erc20TokenWithBalance,
    UseWatchBalancesParams,
    UseWatchBalancesReturnValue,
} from ".";

const collator = new Intl.Collator();

export function useWatchBalancesEvm<T extends UsdPricedErc20Token>({
    address,
    tokens,
    enabled = true,
}: UseWatchBalancesParams<T> = {}): UseWatchBalancesReturnValue<T> {
    const blockNumber = useWatchBlockNumber();

    const {
        data: rewardTokenRawBalances,
        isLoading: loading,
        refetch,
    } = useReadContracts({
        contracts: tokens?.map((token) => {
            return {
                address: token?.address,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address],
            };
        }),
        allowFailure: true,
        query: { enabled: enabled && !!address && !!tokens },
    });

    useEffect(() => {
        if (!enabled) return;
        refetch();
    }, [enabled, blockNumber, refetch]);

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

                const rawBalanceResponse = rewardTokenRawBalances[i];
                if (rawBalanceResponse.status !== "failure") {
                    const rawBalance = rawBalanceResponse.result as bigint;
                    const formattedBalance = Number(
                        formatUnits(rawBalance, token.decimals),
                    );
                    balance = {
                        raw: rawBalance,
                        formatted: formattedBalance,
                    };
                }

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

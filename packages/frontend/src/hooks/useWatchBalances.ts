import type { Erc20Token, OnChainAmount } from "@metrom-xyz/sdk";
import { useEffect, useMemo } from "react";
import { type Address, erc20Abi, formatUnits } from "viem";
import { useBlockNumber, useReadContracts } from "wagmi";

export interface Erc20TokenWithBalance<T extends Erc20Token> {
    token: T;
    balance: OnChainAmount | null;
}

export function useWatchBalances<T extends Erc20Token>(
    address?: Address,
    tokens?: T[],
): {
    tokensWithBalance: Erc20TokenWithBalance<T>[];
    loading: boolean;
} {
    const { data: blockNumber } = useBlockNumber({ watch: true });
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
        query: { enabled: !!address && !!tokens },
    });

    useEffect(() => {
        refetch();
    }, [blockNumber, refetch]);

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

    return { tokensWithBalance, loading };
}

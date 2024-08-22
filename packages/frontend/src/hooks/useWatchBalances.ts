import type { TokenWithBalance, Token } from "@metrom-xyz/sdk";
import { useEffect, useMemo } from "react";
import { type Address, erc20Abi } from "viem";
import { useBlockNumber, useReadContracts } from "wagmi";

export function useWatchBalances<T extends Token>(
    address?: Address,
    tokens?: T[],
): {
    tokensWithBalance: TokenWithBalance[];
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
            return tokens;

        const tokensInChainWithBalance = tokens.reduce(
            (accumulator: Record<string, TokenWithBalance>, token, i) => {
                const rawBalance = rewardTokenRawBalances[i];
                accumulator[`${token.address.toLowerCase()}`] =
                    rawBalance.status !== "failure"
                        ? {
                              ...token,
                              balance: rawBalance.result as bigint,
                          }
                        : { ...token, balance: undefined };
                return accumulator;
            },
            {},
        );

        return Object.values(tokensInChainWithBalance);
    }, [rewardTokenRawBalances, tokens]);

    return { tokensWithBalance, loading };
}

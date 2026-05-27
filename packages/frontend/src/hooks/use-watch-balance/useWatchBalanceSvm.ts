import { useEffect } from "react";
import type { UseWatchBalanceParams, UseWatchBalanceReturnValue } from ".";
import { useWatchBlockNumber } from "../use-watch-block-number";
import { useSolanaClient } from "@solana/react-hooks";
import { useQuery } from "@tanstack/react-query";

export function useWatchBalanceSvm({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): UseWatchBalanceReturnValue {
    const blockNumber = useWatchBlockNumber({ enabled });
    const client = useSolanaClient();

    const {
        data: balance,
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: ["watch-token-balance", blockNumber, token, address, client],
        queryFn: async () => {
            if (!token || !address) return null;

            try {
                return await client
                    .splToken({ mint: token })
                    .fetchBalance(address);
            } catch (error) {
                console.error(
                    `Could not fetch balance for whitelisted token: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!token && !!address && enabled,
    });

    useEffect(() => {
        if (!enabled) return;
        refetch();
    }, [enabled, blockNumber, refetch]);

    return {
        balance: balance ? balance.amount : undefined,
        loading,
    };
}

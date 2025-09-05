import { type Address } from "viem";
import { useEffect } from "react";
import type { UseWatchBalanceParams, UseWatchBalanceReturnValue } from ".";
import { useWatchBlockNumber } from "../use-watch-block-number";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "@aptos-labs/react";

export function useWatchBalanceMvm({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): UseWatchBalanceReturnValue {
    const blockNumber = useWatchBlockNumber({ enabled });
    const { client } = useClients();

    const {
        data: balance,
        isLoading: loading,
        refetch,
    } = useQuery({
        queryKey: [
            "watch-whitelisted-token-balance",
            blockNumber,
            token,
            address,
        ],
        queryFn: async ({ queryKey }) => {
            const [, , token, address] = queryKey as [
                string,
                number | undefined,
                Address | undefined,
                Address | undefined,
            ];

            if (!token || !address) return null;

            try {
                return await client.fetchBalance({
                    address,
                    asset: token,
                });
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
        balance: balance ?? undefined,
        loading,
    };
}

import type { UseWatchBalanceParams, UseWatchBalanceReturnValue } from ".";
import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function useWatchBalanceSui({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): UseWatchBalanceReturnValue {
    const client = useCurrentClient();

    const { data: balance, isLoading: loading } = useQuery({
        queryKey: ["watch-token-balance", token, address],
        queryFn: async ({ queryKey }) => {
            const [, token, address] = queryKey as [
                string,
                string | undefined,
                Address | undefined,
            ];

            if (!token || !address) return null;

            try {
                const response = await client.getBalance({
                    owner: address,
                    coinType: token,
                });

                return BigInt(response.balance.balance);
            } catch (error) {
                console.error(`Could not fetch balance for token: ${error}`);
                throw error;
            }
        },
        enabled: !!token && !!address && enabled,
        refetchInterval: 15000,
    });

    return {
        balance: balance ?? undefined,
        loading,
    };
}

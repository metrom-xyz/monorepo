import type { SupportedChain } from "@metrom-xyz/contracts";
import { metromApiClient } from "../commons";
import { type AmmPool } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function usePool(
    chainId: SupportedChain,
    address?: Address,
): {
    loading: boolean;
    pool?: AmmPool | null;
} {
    const { data: pool, isFetching: loading } = useQuery({
        queryKey: ["pool", chainId, address],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain | undefined;
            const address = queryKey[2] as Address | undefined;
            if (!chainId || !address) return undefined;

            try {
                return await metromApiClient.fetchPool({
                    chainId,
                    address,
                });
            } catch (error) {
                console.error(
                    `Could not fetch pools with address ${address}: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!address,
        staleTime: 0,
    });

    return {
        loading,
        pool,
    };
}

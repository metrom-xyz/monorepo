import type { SupportedChain } from "@metrom-xyz/contracts";
import { metromApiClient } from "../commons";
import { type PoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export function usePool(
    chainId: SupportedChain,
    address?: Address,
): {
    loading: boolean;
    pool?: PoolWithTvl | null;
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
                throw new Error(
                    `Could not fetch pools with address ${address}: ${error}`,
                );
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

import { type AmmPool, type LiquidityInRange } from "@metrom-xyz/sdk";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface UseLiquidityInRangeParams extends HookBaseParams {
    pool?: AmmPool;
    from?: number;
    to?: number;
}

// TODO: maybe we could use this format for all the other hooks too
export function useLiquidityInRange({
    pool,
    from,
    to,
    enabled,
}: UseLiquidityInRangeParams): {
    loading: boolean;
    liquidityInRange?: LiquidityInRange;
} {
    const { data, isLoading } = useQuery({
        queryKey: ["liquidity-in-range", pool, from, to],
        queryFn: async ({ queryKey }) => {
            const pool = queryKey[1] as AmmPool;
            const from = queryKey[2] as number;
            const to = queryKey[3] as number;
            if (!pool || !from || !to) return undefined;

            const chainId = pool.chainId;

            try {
                return metromApiClient.fetchLiquidityInRange({
                    chainId,
                    pool,
                    from,
                    to,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquidity in range ${from}-${to} for pool with address ${pool.address} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!pool,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isLoading,
        liquidityInRange: data,
    };
}

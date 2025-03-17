import { type AmmPool, type LiquidityInRange } from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface UseLiquidityInRangeParams extends HookBaseParams {
    pool?: AmmPool;
    from?: number;
    to?: number;
}

type QueryKey = [
    string,
    AmmPool | undefined,
    number | undefined,
    number | undefined,
];

export function useLiquidityInRange({
    pool,
    from,
    to,
    enabled = true,
}: UseLiquidityInRangeParams = {}): {
    loading: boolean;
    liquidityInRange?: LiquidityInRange;
} {
    const { data, isLoading } = useQuery({
        queryKey: ["liquidity-in-range", pool, from, to],
        queryFn: async ({ queryKey }) => {
            const [, pool, from, to] = queryKey as QueryKey;
            if (!pool || !from || !to) return null;

            try {
                return METROM_API_CLIENT.fetchLiquidityInRange({
                    chainId: pool.chainId,
                    pool,
                    from,
                    to,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquidity in range ${from}-${to} for pool with address ${pool.address} in chain with id ${pool.chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!pool,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isLoading,
        liquidityInRange: data || undefined,
    };
}

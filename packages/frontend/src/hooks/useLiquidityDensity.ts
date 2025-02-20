import { type AmmPool, type LiquidityDensity } from "@metrom-xyz/sdk";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";

const SURROUNDING_AMOUNT = 200;

export function useLiquidityDensity(
    pool?: AmmPool,
    computeAmount?: number,
): {
    loading: boolean;
    liquidityDensity?: LiquidityDensity;
} {
    const { data, isPending } = useQuery({
        queryKey: ["liquidity-density", pool],
        queryFn: async ({ queryKey }) => {
            const pool = queryKey[1] as AmmPool;
            if (!pool) return undefined;

            const chainId = pool.chainId;

            try {
                return metromApiClient.fetchLiquidityDensity({
                    chainId,
                    pool,
                    surroundingAmount: SURROUNDING_AMOUNT,
                    computeAmount,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquidity density for pool with address ${pool.address} in chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: !!pool,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        liquidityDensity: data,
    };
}

import {
    type AmmPool,
    type CampaignAmmPool,
    type LiquidityDensity,
} from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";

interface UseLiquidityDensityParams extends HookBaseParams {
    pool?: AmmPool | CampaignAmmPool;
    computeAmount?: number;
}

type QueryKey = [string, AmmPool | CampaignAmmPool | undefined];

const SURROUNDING_AMOUNT = 200;

export function useLiquidityDensity({
    pool,
    computeAmount,
    enabled = true,
}: UseLiquidityDensityParams = {}): {
    loading: boolean;
    liquidityDensity?: LiquidityDensity;
} {
    const { data, isPending } = useQuery({
        queryKey: ["liquidity-density", pool],
        queryFn: async ({ queryKey }) => {
            const [, pool] = queryKey as QueryKey;
            if (!pool) return null;

            try {
                return METROM_API_CLIENT.fetchLiquidityDensity({
                    chainId: pool.chainId,
                    chainType: pool.chainType,
                    pool,
                    surroundingAmount: SURROUNDING_AMOUNT,
                    computeAmount,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquidity density for pool with id ${pool.id} in chain with id ${pool.chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!pool,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        liquidityDensity: data || undefined,
    };
}

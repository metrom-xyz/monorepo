import {
    RestrictionType,
    type AmmPool,
    type LiquidityByAddresses,
} from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { Address } from "viem";

interface UseLiquidityByAddressesParams extends HookBaseParams {
    pool?: AmmPool;
    type?: RestrictionType;
    addresses?: string[];
}

type QueryKey = [string, AmmPool | undefined, Address[] | undefined];

export function useLiquidityByAddresses({
    pool,
    type,
    addresses,
    enabled = true,
}: UseLiquidityByAddressesParams = {}): {
    loading: boolean;
    liquidityByAddresses?: LiquidityByAddresses;
} {
    const { data, isLoading } = useQuery({
        queryKey: ["liquidity-by-addresses", pool, addresses],
        queryFn: async ({ queryKey }) => {
            const [, pool, addresses] = queryKey as QueryKey;
            if (!pool || !addresses || addresses.length === 0) return null;

            try {
                return METROM_API_CLIENT.fetchLiquidityByAddresses({
                    chainId: pool.chainId,
                    pool,
                    addresses,
                });
            } catch (error) {
                console.error(
                    `Could not fetch liquidity by addresses ${addresses.join(",")} for pool with id ${pool.id} in chain with id ${pool.chainId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!pool && !!addresses && addresses.length > 0,
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isLoading,
        liquidityByAddresses:
            type && data
                ? {
                      type,
                      liquidity: data,
                  }
                : undefined,
    };
}

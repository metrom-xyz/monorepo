import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import type { HookBaseParams } from "../types/hooks";

interface UsePoolParams extends HookBaseParams {
    chainId: SupportedChain;
    address?: Address;
}

type QueryKey = [string, SupportedChain, Address | undefined];

export function usePool({ chainId, address, enabled = true }: UsePoolParams): {
    loading: boolean;
    pool?: AmmPoolWithTvl | null;
} {
    const { data: pool, isFetching: loading } = useQuery({
        queryKey: ["pool", chainId, address],
        queryFn: async ({ queryKey }) => {
            const [, chainId, address] = queryKey as QueryKey;
            if (!chainId || !address) return null;

            try {
                return await METROM_API_CLIENT.fetchPool({
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
        enabled: enabled && !!address,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    return {
        loading,
        pool: pool || undefined,
    };
}

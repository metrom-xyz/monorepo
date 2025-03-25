import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { Address, Hex } from "viem";
import type { HookBaseParams } from "../types/hooks";

interface UsePoolParams extends HookBaseParams {
    chainId: SupportedChain;
    id?: Hex;
}

type QueryKey = [string, SupportedChain, Address | undefined];

export function usePool({ chainId, id, enabled = true }: UsePoolParams): {
    loading: boolean;
    pool?: AmmPoolWithTvl | null;
} {
    const { data: pool, isFetching: loading } = useQuery({
        queryKey: ["pool", chainId, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, id] = queryKey as QueryKey;
            if (!chainId || !id) return null;

            try {
                return await METROM_API_CLIENT.fetchPool({
                    chainId,
                    id,
                });
            } catch (error) {
                console.error(`Could not fetch pools with id ${id}: ${error}`);
                throw error;
            }
        },
        enabled: enabled && !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    return {
        loading,
        pool: pool || undefined,
    };
}

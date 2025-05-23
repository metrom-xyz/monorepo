import type { SupportedChain } from "@metrom-xyz/contracts";
import { METROM_API_CLIENT } from "../commons";
import { SupportedDex, type AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { useProtocolsInChain } from "./useProtocolsInChain";
import { ProtocolType } from "@metrom-xyz/chains";

interface UsePoolsParams extends HookBaseParams {
    chainId: SupportedChain;
    dex?: SupportedDex;
}

type QueryKey = [string, SupportedDex | undefined, SupportedChain];

export function usePools({ chainId, dex, enabled = true }: UsePoolsParams): {
    loading: boolean;
    pools?: AmmPoolWithTvl[];
} {
    const availableDexes = useProtocolsInChain(chainId, ProtocolType.Dex);

    const { data: pools, isPending: loading } = useQuery({
        queryKey: ["pools", dex, chainId],
        queryFn: async ({ queryKey }) => {
            const [, dex, chainId] = queryKey as QueryKey;
            if (!dex) return null;

            try {
                const pools = await METROM_API_CLIENT.fetchAmmPools({
                    chainId,
                    dex,
                });
                return pools;
            } catch (error) {
                console.error(`Could not fetch pools for dex ${dex}: ${error}`);
                throw error;
            }
        },
        refetchOnMount: false,
        enabled:
            enabled &&
            !!dex &&
            !!availableDexes.find(({ slug }) => slug === dex),
    });

    return {
        loading,
        pools: pools || undefined,
    };
}

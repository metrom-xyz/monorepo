import type { SupportedChain } from "@metrom-xyz/contracts";
import { metromApiClient } from "../commons";
import { SupportedDex, type Pool } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { useDexesInChain } from "./useDexesInChain";

export function usePools(
    chainId: SupportedChain,
    dex?: SupportedDex,
): {
    loading: boolean;
    pools?: Pool[];
} {
    const availableDexes = useDexesInChain(chainId);

    const { data: pools, isPending: loading } = useQuery({
        queryKey: ["pools", dex, chainId],
        queryFn: async ({ queryKey }) => {
            const dex = queryKey[1];
            const chainId = queryKey[2];
            if (!dex) return undefined;

            try {
                const pools = await metromApiClient.fetchPools({
                    chainId: chainId as SupportedChain,
                    dex: dex as SupportedDex,
                });
                return pools;
            } catch (error) {
                throw new Error(
                    `Could not fetch pools for dex ${dex}: ${error}`,
                );
            }
        },
        refetchOnMount: false,
        enabled: !!dex && !!availableDexes.find(({ slug }) => slug === dex),
    });

    return {
        loading,
        pools,
    };
}

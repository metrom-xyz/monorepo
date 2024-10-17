import type { SupportedChain } from "@metrom-xyz/contracts";
import { metromApiClient } from "../commons";
import { SupportedAmm, type Pool } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";
import { useAmmsInChain } from "./useAmmsInChain";

export function usePools(
    chainId: SupportedChain,
    amm?: SupportedAmm,
): {
    loading: boolean;
    pools?: Pool[];
} {
    const availableAmms = useAmmsInChain(chainId);

    const { data: pools, isPending: loading } = useQuery({
        queryKey: ["pools", amm, chainId],
        queryFn: async ({ queryKey }) => {
            const amm = queryKey[1];
            const chainId = queryKey[2];
            if (!amm) return undefined;

            try {
                const pools = await metromApiClient.fetchPools({
                    chainId: chainId as SupportedChain,
                    amm: amm as SupportedAmm,
                });
                return pools;
            } catch (error) {
                throw new Error(
                    `Could not fetch pools for amm ${amm}: ${error}`,
                );
            }
        },
        refetchOnMount: false,
        enabled: !!amm && !!availableAmms.find(({ slug }) => slug === amm),
    });

    return {
        loading,
        pools,
    };
}

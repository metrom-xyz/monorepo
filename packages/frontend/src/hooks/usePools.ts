import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { metromApiClient } from "../commons";
import { SupportedAmm, type Pool } from "@metrom-xyz/sdk";
import { useQuery } from "@tanstack/react-query";

export function usePools(ammSlug?: SupportedAmm): {
    loading: boolean;
    pools?: Pool[];
} {
    const chainId: SupportedChain = useChainId();

    const { data: pools, isPending: loading } = useQuery({
        queryKey: ["pools", ammSlug],
        queryFn: async ({ queryKey }) => {
            const amm = queryKey[1];
            if (!amm) return undefined;

            try {
                const pools = await metromApiClient.fetchPools({
                    chainId,
                    amm: amm as SupportedAmm,
                });
                return pools;
            } catch (error) {
                throw new Error(
                    `Could not fetch pools for amm ${ammSlug}: ${error}`,
                );
            }
        },
        refetchOnMount: false,
        enabled: !!ammSlug,
    });

    return {
        loading,
        pools,
    };
}

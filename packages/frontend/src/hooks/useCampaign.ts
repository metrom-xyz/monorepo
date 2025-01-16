import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@metrom-xyz/sdk";

export function useCampaign(
    chainId?: SupportedChain,
    id?: Hex,
): {
    loading: boolean;
    campaign?: Campaign;
} {
    const { data: campaign, isPending: loading } = useQuery({
        queryKey: ["campaign", chainId, id],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain;
            const id = queryKey[2] as Hex;
            if (!chainId || !id) return undefined;

            try {
                return await metromApiClient.fetchCampaign({
                    chainId,
                    id,
                });
            } catch (error) {
                throw new Error(
                    `Could not fetch campaign ${id} for chain with id ${chainId}: ${error}`,
                );
            }
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: !!chainId && !!id,
    });

    return {
        loading,
        campaign,
    };
}

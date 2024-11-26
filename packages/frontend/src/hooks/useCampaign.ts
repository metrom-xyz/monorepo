import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { metromApiClient } from "../commons";
import { getCampaignName } from "../utils/campaign";
import type { NamedCampaign } from "./useCampaigns";
import { useQuery } from "@tanstack/react-query";

export function useCampaign(
    chainId?: SupportedChain,
    id?: Hex,
): {
    loading: boolean;
    campaign?: NamedCampaign;
} {
    const { data: campaign, isPending: loading } = useQuery({
        queryKey: ["campaign", chainId, id],
        queryFn: async ({ queryKey }) => {
            const chainId = queryKey[1] as SupportedChain;
            const id = queryKey[2] as Hex;
            if (!chainId || !id) return undefined;

            try {
                const campaign = await metromApiClient.fetchCampaign({
                    chainId,
                    id,
                });

                return {
                    ...campaign,
                    name: getCampaignName(campaign),
                };
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

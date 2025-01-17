import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";
import { metromApiClient } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName } from "../utils/campaign";
import { useTranslations } from "next-intl";
import { NamedCampaign } from "../types";

export function useCampaign(
    chainId?: SupportedChain,
    id?: Hex,
): {
    loading: boolean;
    campaign?: NamedCampaign;
} {
    const t = useTranslations();

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
                return new NamedCampaign(
                    campaign,
                    getCampaignName(t, campaign),
                );
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

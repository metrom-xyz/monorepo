import type { Hex } from "viem";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { getCrossVmChainData } from "../utils/chain";
import { CAMPAIGN_TARGET_TO_KIND, ChainType } from "@metrom-xyz/sdk";
import { CampaignDetails } from "../types/campaign";

interface UseCampaignDetailsParams extends HookBaseParams {
    chainId?: number;
    chainType?: ChainType;
    id?: Hex;
}

type QueryKey = [
    string,
    number | undefined,
    ChainType | undefined,
    Hex | undefined,
];

export function useCampaignDetails({
    id,
    chainId,
    chainType,
    enabled = true,
}: UseCampaignDetailsParams = {}) {
    const t = useTranslations();

    const { data: campaignDetails, isPending: loading } = useQuery({
        queryKey: ["campaign-details", chainId, chainType, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, id] = queryKey as QueryKey;
            if (!chainId || !chainType || !id) return null;

            try {
                const campaignDetails =
                    await METROM_API_CLIENT.fetchCampaignDetails({
                        chainId,
                        chainType,
                        id,
                    });

                return new CampaignDetails(
                    campaignDetails,
                    getCampaignName(t, campaignDetails),
                    getCampaignTargetValueName(
                        t,
                        CAMPAIGN_TARGET_TO_KIND[campaignDetails.target.type],
                    ),
                    getCrossVmChainData(chainId, chainType),
                );
            } catch (error) {
                console.error(
                    `Could not fetch campaign ${id} for chain with id ${chainId}: ${error}`,
                );
                throw error;
            }
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 60000,
        enabled: enabled && !!chainId && !!chainType && !!id,
    });

    return {
        loading,
        campaignDetails: campaignDetails || undefined,
    };
}

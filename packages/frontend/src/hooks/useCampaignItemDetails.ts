import type { Hex } from "viem";
import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { getCrossVmChainData } from "../utils/chain";
import { CAMPAIGN_TARGET_TO_KIND, ChainType } from "@metrom-xyz/sdk";
import { CampaignItemDetails } from "../types/campaign";

interface UseCampaignItemDetailsParams extends HookBaseParams {
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

export function useCampaignItemDetails({
    id,
    chainId,
    chainType,
    enabled = true,
}: UseCampaignItemDetailsParams = {}) {
    const t = useTranslations();

    const { data: campaignItemDetails, isPending: loading } = useQuery({
        queryKey: ["campaign-item-details", chainId, chainType, id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, id] = queryKey as QueryKey;
            if (!chainId || !chainType || !id) return null;

            try {
                const campaignItemDetails =
                    await METROM_API_CLIENT.fetchCampaignItemDetails({
                        chainId,
                        chainType,
                        id,
                    });

                return new CampaignItemDetails(
                    campaignItemDetails,
                    getCampaignName(t, campaignItemDetails),
                    getCampaignTargetValueName(
                        t,
                        CAMPAIGN_TARGET_TO_KIND[
                            campaignItemDetails.target.type
                        ],
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
        campaignItemDetails: campaignItemDetails || undefined,
    };
}

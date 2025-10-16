import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import { Campaign } from "../types/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { getChainData } from "../utils/chain";
import {
    CAMPAIGN_TARGET_TO_KIND,
    type ChainType,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";
import type { CampaignStatus } from "@metrom-xyz/chains";

interface UseCampaignsParams extends HookBaseParams {
    page: number;
    pageSize: number;
    chainId?: number;
    chainType?: ChainType;
    protocol?: SupportedProtocol;
    status?: CampaignStatus;
}

export function useCampaigns({
    page,
    pageSize,
    chainId,
    chainType,
    protocol,
    status,
    enabled = true,
}: UseCampaignsParams): {
    loading: boolean;
    totalCampaigns: number;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const { data: pagedCampaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns", page, pageSize, chainId, protocol, status],
        queryFn: async () => {
            try {
                const { campaigns, totalItems } =
                    await METROM_API_CLIENT.fetchCampaigns({
                        page,
                        pageSize,
                        chainId,
                        chainType,
                        protocol,
                        status,
                    });

                return {
                    totalItems,
                    campaigns: campaigns
                        .map((campaign) => {
                            return new Campaign(
                                campaign,
                                getCampaignName(t, campaign),
                                getCampaignTargetValueName(
                                    t,
                                    CAMPAIGN_TARGET_TO_KIND[
                                        campaign.target.type
                                    ],
                                ),
                                getChainData(campaign.chainId),
                            );
                        })
                        .sort((a, b) => a.createdAt - b.createdAt),
                };
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`, error);
                throw error;
            }
        },
        enabled,
    });

    return {
        loading,
        totalCampaigns: pagedCampaigns?.totalItems || 0,
        campaigns: pagedCampaigns?.campaigns,
    };
}

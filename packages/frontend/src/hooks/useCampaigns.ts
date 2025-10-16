import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import { Campaign } from "../types/campaign";
import type { HookBaseParams } from "../types/hooks";
import { useTranslations } from "next-intl";
import { getChainData } from "../utils/chain";
import {
    BackendCampaignOrderBy,
    BackendCampaignStatus,
    BackendCampaignType,
    CAMPAIGN_TARGET_TO_KIND,
    type ChainType,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";

interface UseCampaignsParams extends HookBaseParams {
    page: number;
    pageSize: number;
    type: BackendCampaignType;
    chainId?: number;
    chainType?: ChainType;
    protocol?: string;
    status?: string;
    orderBy?: string;
    asc?: boolean;
}

export function useCampaigns({
    page,
    pageSize,
    type,
    chainId,
    chainType,
    protocol,
    status,
    orderBy,
    asc,
    enabled = true,
}: UseCampaignsParams): {
    loading: boolean;
    totalCampaigns: number;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const { data: pagedCampaigns, isPending: loading } = useQuery({
        queryKey: [
            "campaigns",
            page,
            pageSize,
            type,
            chainId,
            chainType,
            protocol,
            status,
            orderBy,
            asc,
        ],
        queryFn: async () => {
            try {
                const { campaigns, totalItems } =
                    await METROM_API_CLIENT.fetchCampaigns({
                        page,
                        pageSize,
                        type,
                        chainId,
                        chainType,
                        protocol: protocol as SupportedProtocol,
                        status: status as BackendCampaignStatus,
                        orderBy: orderBy as BackendCampaignOrderBy,
                        asc,
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

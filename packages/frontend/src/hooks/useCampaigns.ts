import { METROM_API_CLIENT } from "../commons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
    chainIds?: number[];
    chainTypes?: ChainType[];
    protocols?: string[];
    statuses?: string[];
    orderBy?: string;
    asc?: boolean;
}

export function useCampaigns({
    page,
    pageSize,
    type,
    chainIds,
    chainTypes,
    protocols,
    statuses,
    orderBy,
    asc,
    enabled = true,
}: UseCampaignsParams): {
    loading: boolean;
    fetching: boolean;
    placeholderData: boolean;
    totalCampaigns: number;
    campaigns?: Campaign[];
} {
    const t = useTranslations();

    const {
        data: pagedCampaigns,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: [
            "campaigns",
            page,
            pageSize,
            type,
            chainIds,
            chainTypes,
            protocols,
            statuses,
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
                        chainIds,
                        chainTypes,
                        protocols: protocols as SupportedProtocol[],
                        statuses: statuses as BackendCampaignStatus[],
                        orderBy: orderBy as BackendCampaignOrderBy,
                        asc,
                    });

                return {
                    totalItems,
                    campaigns: campaigns.map((campaign) => {
                        return new Campaign(
                            campaign,
                            getCampaignName(t, campaign),
                            getCampaignTargetValueName(
                                t,
                                CAMPAIGN_TARGET_TO_KIND[campaign.target.type],
                            ),
                            getChainData(campaign.chainId),
                        );
                    }),
                };
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`, error);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
        enabled,
    });

    return {
        loading,
        fetching,
        placeholderData,
        totalCampaigns: pagedCampaigns?.totalItems || 0,
        campaigns: pagedCampaigns?.campaigns,
    };
}

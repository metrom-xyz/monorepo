import { METROM_API_CLIENT } from "../commons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { CampaignDetails, CampaignItem } from "../types/campaign";
import { getChainData } from "../utils/chain";
import { useTranslations } from "next-intl";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import { CAMPAIGN_TARGET_TO_KIND } from "@metrom-xyz/sdk";

interface UseCampaignItemsParams extends HookBaseParams {
    page: number;
    pageSize: number;
    campaignDetails?: CampaignDetails;
}

type QueryKey = [string, number, number, CampaignDetails | undefined];

export function useCampaignItems({
    page,
    pageSize,
    campaignDetails,
    enabled = true,
}: UseCampaignItemsParams): {
    loading: boolean;
    fetching: boolean;
    placeholderData: boolean;
    totalCampaignItems: number;
    campaignItems?: CampaignItem[];
} {
    const t = useTranslations();

    const {
        data: pagedItems,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["campaign-items", page, pageSize, campaignDetails],
        queryFn: async ({ queryKey }) => {
            const [, page, pageSize, campaignDetails] = queryKey as QueryKey;
            if (!campaignDetails) return null;

            try {
                const { items, totalItems } =
                    await METROM_API_CLIENT.fetchCampaignItems({
                        page,
                        pageSize,
                        campaignDetails,
                    });

                return {
                    totalItems,
                    items: items.map((item) => {
                        return new CampaignItem(
                            item,
                            getCampaignName(t, item),
                            getCampaignTargetValueName(
                                t,
                                CAMPAIGN_TARGET_TO_KIND[item.target.type],
                            ),
                            getChainData(item.chainId),
                        );
                    }),
                };
            } catch (error) {
                console.error(`Could not fetch campaign items: ${error}`);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
        enabled: enabled && !!campaignDetails,
    });

    return {
        loading,
        fetching,
        placeholderData,
        totalCampaignItems: pagedItems?.totalItems || 0,
        campaignItems: pagedItems?.items,
    };
}

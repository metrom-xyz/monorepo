import { METROM_API_CLIENT } from "../commons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { AggregatedCampaign, AggregatedCampaignItem } from "../types/campaign";
import { getChainData } from "../utils/chain";
import { useTranslations } from "next-intl";
import { getCampaignName, getCampaignTargetValueName } from "../utils/campaign";
import { CAMPAIGN_TARGET_TO_KIND } from "@metrom-xyz/sdk";

interface UseAggregatedCampaignItemsParams extends HookBaseParams {
    page: number;
    pageSize: number;
    aggregatedCampaign?: AggregatedCampaign;
}

type QueryKey = [string, number, number, AggregatedCampaign | undefined];

export function useAggregatedCampaignItems({
    page,
    pageSize,
    aggregatedCampaign,
    enabled = true,
}: UseAggregatedCampaignItemsParams): {
    loading: boolean;
    fetching: boolean;
    placeholderData: boolean;
    totalCampaigns: number;
    items?: AggregatedCampaignItem[];
} {
    const t = useTranslations();

    const {
        data: pagedItems,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: [
            "aggreagated-campaign-items",
            page,
            pageSize,
            aggregatedCampaign,
        ],
        queryFn: async ({ queryKey }) => {
            const [, page, pageSize, aggregatedCampaign] = queryKey as QueryKey;
            if (!aggregatedCampaign) return null;

            try {
                const { items, totalItems } =
                    await METROM_API_CLIENT.fetchAggregatedCampaignItems({
                        page,
                        pageSize,
                        aggregatedCampaign,
                    });

                return {
                    totalItems,
                    items: items.map((item) => {
                        return new AggregatedCampaignItem(
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
                console.error(
                    `Could not fetch aggregated campaign items: ${error}`,
                );
                throw error;
            }
        },
        placeholderData: keepPreviousData,
        enabled: enabled && !!aggregatedCampaign,
    });

    return {
        loading,
        fetching,
        placeholderData,
        totalCampaigns: pagedItems?.totalItems || 0,
        items: pagedItems?.items,
    };
}

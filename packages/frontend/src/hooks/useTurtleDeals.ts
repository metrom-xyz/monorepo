import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { TURTLE_API_BASE_URL } from "../commons";
import type {
    TurtleDealsResponse,
    TurtleDealWithCampaignId,
} from "../types/turtle";

interface UseTurtleDealsProps extends HookBaseParams {
    campaignId?: string;
    dealId?: string;
}

interface UseTurtleDealsReturnValue {
    loading: boolean;
    deals?: TurtleDealWithCampaignId[];
}

type QueryKey = [string, string | undefined, string | undefined];

export function useTurtleDeals({
    enabled,
    campaignId,
    dealId,
}: UseTurtleDealsProps): UseTurtleDealsReturnValue {
    const { data: deals, isLoading: loading } = useQuery({
        queryKey: ["turtle-deals", campaignId, dealId],
        queryFn: async ({ queryKey }) => {
            const [, campaignId, dealId] = queryKey as QueryKey;

            if (!campaignId) return null;

            try {
                const url = new URL("/v1/api/deals", TURTLE_API_BASE_URL);

                if (campaignId) url.searchParams.set("campaign_id", campaignId);
                if (dealId) url.searchParams.set("id_filter", dealId);

                const response = await fetch(url);

                if (!response.ok)
                    throw new Error(
                        `response not ok while fetching turtle deals for campaign ${campaignId}: ${await response.text()}`,
                    );

                const { deals } =
                    (await response.json()) as TurtleDealsResponse;

                return deals
                    .map((deal) => ({ ...deal, campaignId }))
                    .sort((a, b) => {
                        return b.data.apy - a.data.apy;
                    });
            } catch (error) {
                console.error(
                    `Could not fetch turtle deals for campaign ${campaignId}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!campaignId,
    });

    return { loading, deals: deals || undefined };
}

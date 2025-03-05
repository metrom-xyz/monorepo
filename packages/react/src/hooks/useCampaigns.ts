import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type { Campaign } from "@metrom-xyz/sdk";
import { FetchCampaignParams } from "../../../sdk/dist/client/backend";

export type UseCampaignsParams = FetchCampaignParams;

export interface UseCampaignsReturnValue {
    loading: boolean;
    campaigns?: Campaign[];
}

/** https://docs.metrom.xyz/react-library/use-campaigns */
export function useCampaigns(
    params?: UseCampaignsParams,
): UseCampaignsReturnValue {
    const metromClient = useMetromClient();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns", params],
        queryFn: async () => {
            try {
                return await metromClient.fetchCampaigns(params);
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`);
                throw error;
            }
        },
    });

    return {
        loading,
        campaigns,
    };
}

import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type { Campaign } from "@metrom-xyz/sdk";
import { FetchCampaignsParams } from "../../../sdk/dist/client/backend";

type UseCampaignsParams = FetchCampaignsParams;

interface UseCampaignsReturnValue {
    loading: boolean;
    campaigns?: Campaign[];
}

/**
 * Fetches all the valid campaigns that have been created in Metrom. Supports optional filtering.
 *
 * @param {Object} param - The parameters object.
 * @param {BackendCampaignStatus} param.status - The campaign status.
 * @param {string} param.owner - The campaign owner (may be different than the creator if the ownership was transferred).
 * @param {number} param.chainId - The chain id where the campaign live in.
 * @param {SupportedDex} param.dex - The campaign targeted dex.
 *
 * @returns {UseCampaignsReturnValue} Object including the campaigns.
 */
export function useCampaigns(
    params?: UseCampaignsParams,
): UseCampaignsReturnValue {
    const metromClient = useMetromClient();

    const { data: campaigns, isPending: loading } = useQuery({
        queryKey: ["campaigns"],
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

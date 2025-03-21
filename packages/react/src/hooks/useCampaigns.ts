import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type {
    BackendCampaignStatus,
    Campaign,
    SupportedDex,
} from "@metrom-xyz/sdk";
import type { SupportedChain } from "@metrom-xyz/contracts";

export type UseCampaignsParams = {
    status?: BackendCampaignStatus;
    ownder?: Address;
    chainId?: SupportedChain;
    dex?: SupportedDex;
};

export interface UseCampaignsReturnValue {
    loading: boolean;
    campaigns?: Campaign[];
}

/** https://docs.metrom.xyz/react-library/use-campaigns */
export function useCampaigns(
    params?: UseCampaignsParams,
): UseCampaignsReturnValue {
    const metromClient = useMetromClient();

    const { data: campaigns, isLoading: loading } = useQuery({
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

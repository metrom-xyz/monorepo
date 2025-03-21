import type { Hex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type { Campaign } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";

export type UseCampaignParams = {
    chainId?: SupportedChain;
    id?: Hex;
};

export interface UseCampaignReturnValue {
    loading: boolean;
    campaign?: Campaign;
}

type QueryKey = [string, SupportedChain | undefined, Hex | undefined];

/** https://docs.metrom.xyz/react-library/use-campaign */
export function useCampaign(
    params?: UseCampaignParams,
): UseCampaignReturnValue {
    const metromClient = useMetromClient();

    const { data: campaign, isLoading: loading } = useQuery({
        queryKey: ["campaign", params?.chainId, params?.id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, id] = queryKey as QueryKey;
            if (!chainId || !id) return null;

            try {
                return await metromClient.fetchCampaign({ chainId, id });
            } catch (error) {
                console.error(`Could not fetch campaign: ${error}`);
                throw error;
            }
        },
    });

    return {
        loading,
        campaign: campaign || undefined,
    };
}

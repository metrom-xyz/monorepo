import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type {
    BackendCampaignStatus,
    Campaign,
    SupportedDex,
} from "@metrom-xyz/sdk";
import { QueryOptions, type QueryResult } from "../types";

export interface UseCampaignsParams
    extends QueryOptions<Campaign[] | undefined> {
    status?: BackendCampaignStatus;
    owner?: Address;
    chainId?: number;
    dex?: SupportedDex;
}

export type UseCampaignsReturnValue = QueryResult<Campaign[] | undefined>;

/** https://docs.metrom.xyz/react-library/use-campaigns */
export function useCampaigns(
    params?: UseCampaignsParams,
): UseCampaignsReturnValue {
    const metromClient = useMetromClient();

    const { data, isLoading, isPending, isFetching } = useQuery({
        ...params?.options,
        queryKey: [
            "campaigns",
            params?.status,
            params?.owner,
            params?.chainId,
            params?.dex,
        ],
        queryFn: async () => {
            try {
                return await metromClient.fetchCampaigns({
                    status: params?.status,
                    owner: params?.owner,
                    chainId: params?.chainId,
                    dex: params?.dex,
                });
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`);
                throw error;
            }
        },
    });

    return { data, isLoading, isPending, isFetching };
}

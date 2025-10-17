import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import type {
    BackendCampaignOrderBy,
    BackendCampaignStatus,
    BackendCampaignType,
    Campaign,
    ChainType,
    SupportedProtocol,
} from "@metrom-xyz/sdk";
import { QueryOptions, type QueryResult } from "../types";

export interface UseCampaignsParams
    extends QueryOptions<PaginatedCampaigns | undefined> {
    page: number;
    pageSize: number;
    type: BackendCampaignType;
    chainIds?: number[];
    chainTypes?: ChainType[];
    protocols?: SupportedProtocol[];
    statuses?: BackendCampaignStatus[];
    orderBy?: BackendCampaignOrderBy;
    asc?: boolean;
}

interface PaginatedCampaigns {
    totalItems: number;
    campaigns: Campaign[];
}

export type UseCampaignsReturnValue = QueryResult<
    PaginatedCampaigns | undefined
>;

/** https://docs.metrom.xyz/react-library/use-campaigns */
export function useCampaigns(
    params: UseCampaignsParams,
): UseCampaignsReturnValue {
    const metromClient = useMetromClient();

    const { data, isLoading, isPending, isFetching } = useQuery({
        ...params?.options,
        queryKey: [
            "campaigns",
            params.page,
            params.pageSize,
            params.type,
            params.chainIds,
            params.chainTypes,
            params.protocols,
            params.statuses,
            params.orderBy,
            params.asc,
        ],
        queryFn: async () => {
            try {
                return await metromClient.fetchCampaigns(params);
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`);
                throw error;
            }
        },
    });

    return { data, isLoading, isPending, isFetching };
}

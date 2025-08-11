import type { Hex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useMetromClient } from "./useMetromClient";
import { Campaign, ChainType } from "@metrom-xyz/sdk";
import type { QueryOptions, QueryResult } from "../types";

export interface UseCampaignParams extends QueryOptions<Campaign | undefined> {
    chainId?: number;
    chainType?: ChainType;
    id?: Hex;
}

export type UseCampaignReturnValue = QueryResult<Campaign | undefined>;

type QueryKey = [string, number, ChainType, Hex];

/** https://docs.metrom.xyz/react-library/use-campaign */
export function useCampaign(
    params?: UseCampaignParams,
): UseCampaignReturnValue {
    const metromClient = useMetromClient();

    const chainType = params?.chainType || ChainType.Evm;
    const { data, isLoading, isPending, isFetching } = useQuery({
        ...params?.options,
        queryKey: ["campaign", params?.chainId, chainType, params?.id],
        queryFn: async ({ queryKey }) => {
            const [, chainId, chainType, id] = queryKey as QueryKey;

            try {
                return await metromClient.fetchCampaign({
                    chainId,
                    chainType,
                    id,
                });
            } catch (error) {
                console.error(`Could not fetch campaign: ${error}`);
                throw error;
            }
        },
        enabled:
            !!params?.chainId &&
            !!params?.id &&
            !!chainType &&
            (params.options?.enabled ?? true),
    });

    return { data, isLoading, isPending, isFetching };
}

import { METROM_API_CLIENT } from "../commons";
import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import {
    BackendCampaignType,
    type ChainType,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";

interface UseCampaignsCountParams extends HookBaseParams {
    chainIds?: number[];
    chainTypes?: ChainType[];
    protocols?: string[];
}

export function useCampaignsCount({
    chainIds,
    chainTypes,
    protocols,
    enabled = true,
}: UseCampaignsCountParams): {
    loading: boolean;
    fetching: boolean;
    rewards?: number;
    points?: number;
} {
    const {
        data,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["campaigns-count", chainIds, chainTypes, protocols],
        queryFn: async () => {
            try {
                const { totalItems: rewards } =
                    await METROM_API_CLIENT.fetchCampaigns({
                        page: 1,
                        pageSize: 0,
                        type: BackendCampaignType.Rewards,
                        chainIds,
                        chainTypes,
                        protocols: protocols as SupportedProtocol[],
                    });
                const { totalItems: points } =
                    await METROM_API_CLIENT.fetchCampaigns({
                        page: 1,
                        pageSize: 0,
                        type: BackendCampaignType.Points,
                        chainIds,
                        chainTypes,
                        protocols: protocols as SupportedProtocol[],
                    });

                return {
                    rewards,
                    points,
                };
            } catch (error) {
                console.error(
                    `Could not fetch campaigns count: ${error}`,
                    error,
                );
                throw error;
            }
        },
        enabled,
    });

    return {
        loading,
        fetching,
        ...data,
    };
}

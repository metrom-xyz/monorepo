import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { METROM_API_CLIENT } from "../commons";
import type { BackendCampaignTypeAndProjects } from "../components/campaigns";

interface UseCampaignsCountParams extends HookBaseParams {
    type?: BackendCampaignTypeAndProjects;
}

interface UseCampaignsCountReturnValue {
    loading: boolean;
    fetching: boolean;
    count?: number;
}

export function useCampaignsCount({
    type,
    enabled,
}: UseCampaignsCountParams): UseCampaignsCountReturnValue {
    const {
        data: count,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["campaigns-count", type],
        queryFn: async () => {
            if (!type) return null;
            // TODO: if the projects are configured on the FE get this value from the config files, otherwise fetch from API
            if (type === "projects") return 0;

            try {
                const { totalItems } = await METROM_API_CLIENT.fetchCampaigns({
                    page: 1,
                    pageSize: 0,
                    type,
                });

                return totalItems;
            } catch (error) {
                console.error(`Could not fetch campaigns: ${error}`, error);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
        enabled,
    });

    return {
        loading,
        fetching,
        count: count !== null ? count : undefined,
    };
}

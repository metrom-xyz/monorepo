import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams, HookCrossVmParams } from "../types/hooks";
import { ChainType, type Project } from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";

interface UseProjectsParams extends HookBaseParams, HookCrossVmParams {
    chainType?: ChainType;
}

interface UseProjectsReturnValue {
    loading: boolean;
    fetching: boolean;
    placeholderData: boolean;
    projects?: Project[];
}

export function useProjects({
    enabled,
    chainType,
    crossVm = true,
}: UseProjectsParams = {}): UseProjectsReturnValue {
    const {
        data: projects,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["projects", chainType, crossVm],
        queryFn: async () => {
            try {
                return await METROM_API_CLIENT.fetchProjects({
                    chainType,
                    crossVm,
                });
            } catch (error) {
                console.error(`Could not fetch projects: ${error}`);
                throw error;
            }
        },
        placeholderData: keepPreviousData,
        enabled,
    });

    return {
        loading,
        fetching,
        placeholderData,
        projects: projects || [],
    };
}

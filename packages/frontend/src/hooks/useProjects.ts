import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import { type Project } from "@metrom-xyz/sdk";
import { METROM_API_CLIENT } from "../commons";

type UseProjectsParams = HookBaseParams;

interface UseProjectsReturnValue {
    loading: boolean;
    fetching: boolean;
    placeholderData: boolean;
    projects?: Project[];
}

export function useProjects({
    enabled,
}: UseProjectsParams = {}): UseProjectsReturnValue {
    const {
        data: projects,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            try {
                return await METROM_API_CLIENT.fetchProjects();
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

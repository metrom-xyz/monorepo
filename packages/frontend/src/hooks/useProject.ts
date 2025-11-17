import { useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { Project } from "../types/project";

interface UseProjectParams extends HookBaseParams {
    name: string;
}

interface UseProjectReturnValue {
    loading: boolean;
    fetching: boolean;
    project?: Project;
}

type QueryKey = [string, string];

export function useProject({
    name,
    enabled,
}: UseProjectParams): UseProjectReturnValue {
    const {
        data: project,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["project", name],
        queryFn: async ({ queryKey }) => {
            const [, name] = queryKey as QueryKey;

            return {
                name,
                types: [],
                activeCampaigns: 10,
                totalCampaigns: 14,
                chains: [],
            };
            // TODO: implement API call
        },
        enabled,
    });

    return {
        loading,
        fetching,
        project: project || undefined,
    };
}

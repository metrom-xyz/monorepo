import type { HookBaseParams } from "../types/hooks";
import type { Project } from "@metrom-xyz/sdk";
import { useProjects } from "./useProjects";

interface UseProjectParams extends HookBaseParams {
    slug: string;
}

interface UseProjectReturnValue {
    loading: boolean;
    fetching: boolean;
    project?: Project;
}

export function useProject({
    slug,
    enabled,
}: UseProjectParams): UseProjectReturnValue {
    const { loading, fetching, projects } = useProjects({ enabled });

    return {
        loading,
        fetching,
        project: projects?.find((project) => project.slug === slug),
    };
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { Project } from "../types/project";
import { gnosis, lens, mainnet, scroll, sonic } from "viem/chains";

interface UseProjectsParams extends HookBaseParams {
    // TODO: what filters do we want?
    page: number;
    pageSize: number;
    chainIds?: number[];
}

interface UseProjectsReturnValue {
    loading: boolean;
    fetching: boolean;
    totalItems: number;
    placeholderData: boolean;
    projects?: Project[];
}

// type QueryKey = [string, number, number, number[] | undefined];

export function useProjects({
    page,
    pageSize,
    chainIds,
    enabled,
}: UseProjectsParams): UseProjectsReturnValue {
    const {
        data: pagedProjects,
        isPlaceholderData: placeholderData,
        isPending: loading,
        isFetching: fetching,
    } = useQuery({
        queryKey: ["projects", page, pageSize, chainIds],
        queryFn: async () => {
            // const [, page, pageSize, chainIds] = queryKey as QueryKey;

            return {
                totalItems: 0,
                projects: [
                    {
                        name: "quill",
                        types: ["lending"],
                        activeCampaigns: 10,
                        totalCampaigns: 14,
                        chains: [mainnet.id, scroll.id, lens.id, gnosis.id],
                    },
                    {
                        name: "orki",
                        types: ["tge", "lending"],
                        activeCampaigns: 26,
                        totalCampaigns: 30,
                        chains: [mainnet.id, gnosis.id],
                    },
                    {
                        name: "ebisu",
                        types: ["dex", "lending"],
                        activeCampaigns: 8,
                        totalCampaigns: 10,
                        chains: [scroll.id, lens.id, gnosis.id],
                    },
                    {
                        name: "lens",
                        types: ["dex"],
                        activeCampaigns: 11,
                        totalCampaigns: 11,
                        chains: [lens.id],
                    },
                    {
                        name: "amped",
                        types: ["lending"],
                        activeCampaigns: 4,
                        totalCampaigns: 4,
                        chains: [sonic.id],
                    },
                    {
                        name: "katana",
                        types: ["lending"],
                        activeCampaigns: 1,
                        totalCampaigns: 1,
                        chains: [mainnet.id],
                    },
                ],
            } as { totalItems: number; projects?: Project[] };
            // TODO: implement API call
        },
        placeholderData: keepPreviousData,
        enabled,
    });

    return {
        loading,
        fetching,
        placeholderData,
        totalItems: pagedProjects?.totalItems || 0,
        projects: pagedProjects?.projects || [],
    };
}

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { HookBaseParams } from "../types/hooks";
import type { Project } from "../types/project";
import { katana, lens, mainnet, scroll, sonic, swellchain } from "viem/chains";
import { CHAIN_TYPE } from "../commons";
import { ChainType } from "@metrom-xyz/sdk";

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

// TODO: remove this once we have the projects API
const PROJECTS: Project[] = [
    {
        name: "quill",
        types: [],
        activeCampaigns: 10,
        totalCampaigns: 14,
        chains: [scroll.id],
    },
    {
        name: "orki",
        types: [],
        activeCampaigns: 26,
        totalCampaigns: 30,
        chains: [swellchain.id],
    },
    {
        name: "ebisu",
        types: [],
        activeCampaigns: 8,
        totalCampaigns: 10,
        chains: [mainnet.id],
    },
    {
        name: "lens",
        types: [],
        activeCampaigns: 11,
        totalCampaigns: 11,
        chains: [lens.id],
    },
    {
        name: "amped",
        types: [],
        activeCampaigns: 4,
        totalCampaigns: 4,
        chains: [sonic.id],
    },
    {
        name: "katana",
        types: [],
        activeCampaigns: 1,
        totalCampaigns: 1,
        chains: [mainnet.id, katana.id],
    },
];

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

            // TODO: implement API call
            return {
                totalItems: 0,
                projects: CHAIN_TYPE === ChainType.Evm ? PROJECTS : [],
            } as { totalItems: number; projects?: Project[] };
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

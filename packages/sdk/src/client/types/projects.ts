import type { ChainType } from "src/types/commons";

export interface BackendProjectCampaignTotals {
    active: number;
    total: number;
}

export interface BackendProject {
    slug: string;
    campaigns: Record<ChainType, BackendProjectCampaignTotals>;
}

export interface BackendProjectsResponse {
    projects: BackendProject[];
}

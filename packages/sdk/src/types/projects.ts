export interface ProjectCampaignTotals {
    active: number;
    total: number;
}

export interface Project {
    slug: string;
    campaigns: ProjectCampaignTotals;
}

import type { ChainType } from "src/types/commons";

export type ProjectKind =
    | "generic-protocol"
    | "points-tracking"
    | "partner"
    | "liquidity-deals"
    | "chain";

export interface ProjectBranding {
    main: string;
    light: string;
    contrast: {
        light: string;
        dark: string;
    };
    iconBackground: string;
}

export interface ProjectArticle {
    title: string;
    href: string;
}

export interface ProjectIntro {
    articles: ProjectArticle[];
}

export interface BackendProjectCampaignTotals {
    active: number;
    total: number;
}

export interface BackendProject {
    slug: string;
    kind: ProjectKind;
    name: string;
    types: string[];
    description: string;
    url: string;
    branding: ProjectBranding;
    intro?: ProjectIntro;
    campaignId?: string;
    chainType?: ChainType;
    chainId?: number;
    campaigns: Partial<Record<ChainType, BackendProjectCampaignTotals>>;
}

export interface BackendProjectsResponse {
    projects: BackendProject[];
}

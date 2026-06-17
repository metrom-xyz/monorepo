import type {
    ProjectBranding,
    ProjectIntro,
    ProjectKind,
} from "../client/types/projects";
import type { ChainType } from "./commons";

export type {
    ProjectKind,
    ProjectBranding,
    ProjectIntro,
    ProjectArticle,
} from "../client/types/projects";

export interface ProjectCampaignTotals {
    active: number;
    total: number;
}

export interface Project {
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
    campaigns: ProjectCampaignTotals;
}

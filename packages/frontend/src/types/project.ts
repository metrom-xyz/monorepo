import { type Project as ProjectSdk } from "@metrom-xyz/sdk";

export type {
    ProjectKind,
    ProjectIntro,
    ProjectArticle as Article,
    ProjectCampaignTotals,
} from "@metrom-xyz/sdk";

export interface ProjectBranding {
    main: string;
    light: string;
    contrast: {
        light: string;
        dark: string;
    };
    iconBackground: string;
}

export interface Project extends ProjectSdk {
    branding: ProjectBranding;
}

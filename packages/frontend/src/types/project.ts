import type { SVGIcon } from "@metrom-xyz/chains";
import type { ChainType } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";

export interface Project {
    name: string;
    chains: number[];
    activeCampaigns: number;
    totalCampaigns: number;
    types: string[];
}

export interface Branding {
    main: string;
    light: string;
    contrast: {
        light: string;
        dark: string;
    };
    iconBackground: string;
}

export interface Article {
    title: string;
    href: string;
}

export interface ProjectIntro {
    articles: Article[];
}

export enum ProjectKind {
    PointsTracking,
    Partner,
    LiquidityDeals,
    Chain,
}

export interface BaseProjectMetadata {
    name: string;
    description: string;
    url: string;
    icon: FunctionComponent<SVGIcon>;
    illustration: FunctionComponent<SVGIcon>;
    branding: Branding;
    intro?: ProjectIntro;
    leaderboard?: boolean;
}

export interface ProjectMetadataPointsTracking extends BaseProjectMetadata {
    kind: ProjectKind.PointsTracking;
}

export interface ProjectMetadataPartner extends BaseProjectMetadata {
    kind: ProjectKind.Partner;
}

export interface ProjectMetadataLiquidityDeals extends BaseProjectMetadata {
    kind: ProjectKind.LiquidityDeals;
}

export interface ProjectMetadataChain extends BaseProjectMetadata {
    kind: ProjectKind.Chain;
    chainType: ChainType;
    chainId: number;
}

export type ProjectMetadata =
    | ProjectMetadataPointsTracking
    | ProjectMetadataPartner
    | ProjectMetadataLiquidityDeals
    | ProjectMetadataChain;

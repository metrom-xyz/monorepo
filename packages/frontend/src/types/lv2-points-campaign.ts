import type { SupportedGmxV1, SupportedLiquityV2 } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import type { Address } from "viem";
import type { SVGIcon } from "./common";
import type { LocalizedMessage } from "./utils";
import type { ChainWithType } from "./chain";
import type { Branding, ProjectIntro } from "./project";

export interface Lv2BackendPointsLeaderboardRank {
    account: Address;
    weight: number;
    position: number;
    distributed: number;
}

export interface Lv2BackendLeaderboardResponse {
    items: Lv2BackendPointsLeaderboardRank[];
    totalItems: number;
}

export interface Lv2BackendLiquidityLandUsersResponse {
    accounts: Address[];
}

export interface Action {
    name: string;
    targets: Address[];
    multiplier: number;
    tooltip?: LocalizedMessage<"lv2PointsCampaignPage.action">;
    minimumDuration: number;
    href?: string;
    description?: string;
}

export interface ActionsGroup {
    title: string;
    description: string;
    boost?: number;
    actions: Action[];
}

export interface Lv2PointsCampaign {
    name: string;
    description: string;
    url: string;
    chain: ChainWithType;
    protocol: SupportedLiquityV2 | SupportedGmxV1;
    pointsName: string;
    brand: Branding;
    icon: FunctionComponent<SVGIcon>;
    illustration: FunctionComponent<SVGIcon>;
    protocolIntro?: ProjectIntro;
    from: number;
    to: number;
    leaderboard: boolean;
    actions: Record<Lv2PointsCampaign2Action, ActionsGroup | null>;
}

export enum Lv2PointsCampaign2Action {
    Debt = "debt",
    StabilityPool = "stabilty-pool",
    Liquidity = "liquidity",
    NetSwapVolume = "net-swap-volume",
}

export type Lv2PointsCampaigns = Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
>;

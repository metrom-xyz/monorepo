import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import type { Address } from "viem";
import type { SVGIcon } from "./common";

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

export interface Action {
    name: string;
    icon: FunctionComponent<SVGIcon>;
    description?: string;
}

export interface Lv2PointsCampaign {
    name: string;
    description: string;
    url: string;
    protocol: SupportedLiquityV2;
    icon: FunctionComponent<SVGIcon>;
    from: number;
    to: number;
    actions: Record<Lv2PointsCampaign2Action, Action[]>;
}

export enum Lv2PointsCampaign2Action {
    Debt = "debt",
    StabilityPool = "stabilty-pool",
    Liquidity = "liquidity",
}

export type Lv2PointsCampaigns = Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
>;

import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import type { Address } from "viem";
import type { SVGIcon } from "./common";
import type { SupportedChain } from "@metrom-xyz/contracts";

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
    targets: Address[];
    multiplier: number;
    minimumDuration: number;
    description?: string;
}

export interface ActionsGroup {
    title: string;
    description: string;
    actions: Action[];
}

export interface Lv2PointsCampaign {
    name: string;
    description: string;
    url: string;
    chain: SupportedChain;
    protocol: SupportedLiquityV2;
    brandColor: string;
    icon: FunctionComponent<SVGIcon>;
    from: number;
    to: number;
    actions: Record<Lv2PointsCampaign2Action, ActionsGroup>;
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

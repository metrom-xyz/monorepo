import type { ChainContract } from "viem";
import type { Component } from "vue";
import type { AmmSubgraphClient, MetromApiClient, MetromSubgraphClient, Pair } from "sdk";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { Dayjs } from "dayjs";
import type { TokenInfoWithBalance } from "./components/campaign-creation-form/rewards/types";

export enum SupportedAmm {
    Univ3 = "uni-v3",
    AlgebraIntegral = "algebra-integral",
}

export interface CampaignState {
    network: number;
    amm?: AccordionSelectOption<string>;
    pair?: Pair;
    rewards: Reward[];
    range?: Range;
}

export interface FinalizedState {
    network: number;
    amm: AccordionSelectOption<string>;
    pair: Pair;
    rewards: Required<Reward>[];
    range: Required<Range>;
}

export interface Reward {
    id: string;
    token?: TokenInfoWithBalance;
    amount?: number;
}

export interface Range {
    from?: Dayjs;
    to?: Dayjs;
}

export interface ChainIconData {
    logo: Component;
    backgroundColor: string;
}

export interface Amm {
    slug: string;
    name: string;
    addLiquidityUrl: string;
    pairExplorerUrl?: string;
    logo: Component;
    subgraphClient: AmmSubgraphClient;
}

export interface ChainData {
    icon: ChainIconData;
    contract: ChainContract;
    metromApiClient: MetromApiClient,
    metromSubgraphClient: MetromSubgraphClient;
    amms: Amm[];
}

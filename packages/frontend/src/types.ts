import type { ChainContract } from "viem";
import type { Component } from "vue";
import type { AmmSubgraphClient, MetromApiClient, Pair } from "sdk";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { Dayjs } from "dayjs";
import type { TokenInfoWithBalance } from "./components/campaign-creation-form/rewards/types";

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
    metromApiClient: MetromApiClient;
    amms: Amm[];
}

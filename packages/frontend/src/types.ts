import type { ChainContract } from "viem";
import type { Component } from "vue";
import type { AmmSubgraphClient, MetromSubgraphClient, Pair } from "sdk";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { TokenInfo } from "@uniswap/token-lists";
import type { Dayjs } from "dayjs";

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
    token?: TokenInfo;
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
    logo: Component;
    subgraphClient: AmmSubgraphClient;
}

export interface ChainData {
    icon: ChainIconData;
    contract: ChainContract;
    metromSubgraphClient: MetromSubgraphClient;
    amms: Amm[];
}

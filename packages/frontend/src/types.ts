import type { Address, ChainContract } from "viem";
import type { Component } from "vue";
import type { AmmSubgraphClient, Erc20Token, MetromApiClient, Pool } from "sdk";
import type { AccordionSelectOption, Range, TokenInfo } from "@metrom-xyz/ui";

export interface CampaignState {
    network: number;
    amm?: AccordionSelectOption<string>;
    pool?: Pool;
    rewards: Reward[];
    range?: Range;
    restrictions?: {
        type: "blacklist" | "whitelist";
        list: Address[];
    };
}

export interface FinalizedState {
    network: number;
    amm: AccordionSelectOption<string>;
    pool: Pool;
    rewards: Required<Reward>[];
    specification?: {
        [key: string]: Address[];
    };
    range: Required<Range>;
}

export interface Reward {
    id: string;
    token?: TokenInfo;
    amount?: bigint;
}

export interface ChainIconData {
    logo: Component;
    backgroundColor: string;
}

export interface Amm {
    slug: string;
    name: string;
    addLiquidityUrl: string;
    poolExplorerUrl?: string;
    logo: Component;
    subgraphClient: AmmSubgraphClient;
}

export interface ChainData {
    icon: ChainIconData;
    contract: ChainContract;
    metromApiClient: MetromApiClient;
    amms: Amm[];
    popularTokens: Erc20Token[];
}

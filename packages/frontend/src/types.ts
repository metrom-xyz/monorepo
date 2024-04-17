import type { ChainContract } from "viem";
import type { Component } from "vue";
import type { AmmSubgraphClient } from "sdk";

export interface ChainIconData {
    logo: Component;
    backgroundColor: string;
}

export interface Amm {
    slug: string;
    name: string;
    logo: Component;
    subgraphClient: AmmSubgraphClient;
}

export interface ChainData {
    icon: ChainIconData;
    contracts: {
        factory: ChainContract;
    };
    amms: Amm[];
}

import type { Chain, ChainContract } from "viem";
import type { Component } from "vue";

export enum Environment {
    Local = "local",
    Development = "development",
    Staging = "staging",
    Production = "production",
}

export interface ChainIconData {
    logo: Component;
    backgroundColor: string;
}

export interface AmmSubgraph {
    logo: Component;
    name: string;
    url: string;
}

export interface SupportedChain extends Chain {
    contracts: {
        ensRegistry?: ChainContract;
        ensUniversalResolver?: ChainContract;
        multicall3: ChainContract;
        factory: ChainContract;
    };
    subgraphUrl?: string;
    ammSubgraphs?: AmmSubgraph[];
}

export interface MetromChain extends SupportedChain {
    icon: ChainIconData;
}

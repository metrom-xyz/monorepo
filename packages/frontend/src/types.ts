import type { ChainContract } from "viem";
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

export interface Amm {
    logo: Component;
    name: string;
    subgraphUrl: string;
}

export interface ChainData {
    icon: ChainIconData;
    contracts: {
        factory: ChainContract;
    };
    subgraphUrl?: string;
    amms: Amm[];
}

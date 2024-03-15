import type { SupportedChain } from "@carrot-kpi/sdk";
import type { Component } from "vue";

export interface ChainIconData {
    logo: Component;
    backgroundColor: string;
}

export interface MetromChain extends SupportedChain {
    icon: ChainIconData;
}

export const enum ChainId {
    Gnosis,
    Celo,
}

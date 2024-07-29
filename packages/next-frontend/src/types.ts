import type {
    AmmSubgraphClient,
    Erc20Token,
    MetromApiClient,
} from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import type { ChainContract } from "viem";

export interface Amm {
    slug: string;
    name: string;
    addLiquidityUrl: string;
    poolExplorerUrl?: string;
    logo: FunctionComponent;
    subgraphClient: AmmSubgraphClient;
}

export interface ChainIconData {
    logo: FunctionComponent;
    backgroundColor: string;
}

export interface ChainData {
    icon: ChainIconData;
    contract: ChainContract;
    metromApiClient: MetromApiClient;
    amms: Amm[];
    baseTokens: Erc20Token[];
}

import type { FunctionComponent } from "react";
import type { SVGIcon } from "./common";
import type { ChainWithType } from "./chain";
import type { Branding } from "./project";

export interface Token {
    address: string;
    name: string;
    symbol: string;
    logos: string[];
    decimals: number;
    chain: number;
    price?: number;
}

export interface Metadata {
    description: string;
    iconUrl: string;
    id: string;
    name: string;
}

export interface Data {
    apy: number;
    apy_base: number;
    apy_reward: number;
    tvl: number;
}

export interface TurtleDeal {
    protocol: string;
    token: Token;
    underlying_tokens: Token[];
    metadata: Metadata;
    data: Data;
}

export interface TurtleDealWithCampaignId extends TurtleDeal {
    campaignId: string;
}

export interface TurtleDealsResponse {
    deals: TurtleDeal[];
    // TODO: do we need the metadata here?
    // metadata: TBD
}

export interface TurtleCampaign {
    id: string;
    chain: ChainWithType;
    distributor: string;
    name: string;
    description: string;
    url: string;
    brand: Branding;
    owner: string;
    ownerLogo: FunctionComponent<SVGIcon>;
}

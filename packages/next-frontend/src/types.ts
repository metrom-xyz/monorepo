import type {
    AmmSubgraphClient,
    Erc20Token,
    MetromApiClient,
    Pool,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { SVGProps, FunctionComponent } from "react";
import type { ChainContract } from "viem";

type PropertyUnion<T> = {
    [K in keyof T]: { [P in K]: T[K] };
}[keyof T];
export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

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

// TODO: define state
export interface CampaignPayload {
    network?: number;
    amm?: string;
    pool?: Pool;
    startDate?: Dayjs;
    endDate?: Dayjs;
    // rewards: Reward[];
    // restrictions?: {
    //     type: "blacklist" | "whitelist";
    //     list: Address[];
    // };
}

export type CampaignPayloadPart = PropertyUnion<CampaignPayload>;

import type {
    Token,
    MetromApiClient,
    Pool,
    SupportedAmm,
    WhitelistedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { SVGProps, FunctionComponent } from "react";
import type { ChainContract } from "viem";

type PropertyUnion<T> = {
    [K in keyof T]: { [P in K]: T[K] };
}[keyof T];
export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export interface Amm {
    slug: SupportedAmm;
    name: string;
    addLiquidityUrl: string;
    poolExplorerUrl?: string;
    logo: FunctionComponent;
}

export interface ChainIconData {
    logo: FunctionComponent;
    backgroundColor: string;
}

export interface ChainData {
    icon: ChainIconData;
    contract: ChainContract;
    amms: Amm[];
    baseTokens: Token[];
}

// TODO: define state
export interface CampaignPayload {
    network?: number;
    amm?: AmmInfo;
    pool?: Pool;
    startDate?: Dayjs;
    endDate?: Dayjs;
    rewards?: WhitelistedErc20TokenAmount[];
    // restrictions?: {
    //     type: "blacklist" | "whitelist";
    //     list: Address[];
    // };
}

export interface CampaignPayloadErrors {
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
}
export type AmmInfo = Pick<Amm, "slug" | "name" | "logo">;
export type CampaignPayloadPart = PropertyUnion<CampaignPayload>;

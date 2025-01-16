import type {
    AmmPool,
    FeeToken,
    KpiSpecification,
    SupportedDex,
    UsdPricedOnChainAmount,
    WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { SVGProps, FunctionComponent } from "react";
import type { Address } from "viem";

type PropertyUnion<T> = {
    [K in keyof T]: { [P in K]: T[K] };
}[keyof T];
export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export interface Dex {
    slug: SupportedDex;
    name: string;
    addLiquidityUrl: string;
    poolExplorerUrl?: string;
    logo: FunctionComponent<SVGIcon>;
}

export enum RestrictionType {
    blacklist = "blacklist",
    whitelist = "whitelist",
}

export enum RewardType {
    Points = "points",
    Tokens = "tokens",
}

export interface WhitelistedErc20TokenAmount {
    token: WhitelistedErc20Token;
    amount: UsdPricedOnChainAmount;
}

export interface CampaignPayload {
    network?: number;
    rewardType?: RewardType;
    dex?: DexInfo;
    pool?: AmmPool;
    startDate?: Dayjs;
    endDate?: Dayjs;
    points?: number;
    tokens?: WhitelistedErc20TokenAmount[];
    fee?: WhitelistedErc20TokenAmount;
    kpiSpecification?: KpiSpecification;
    restrictions?: {
        type: RestrictionType;
        list: Address[];
    };
}

export interface CampaignPayloadErrors {
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    kpiSpecification?: boolean;
    restrictions?: boolean;
}

export type DexInfo = Pick<Dex, "slug" | "name" | "logo">;

export type CampaignPayloadPart = PropertyUnion<CampaignPayload>;

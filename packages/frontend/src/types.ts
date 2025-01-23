import type {
    KpiSpecification,
    PoolWithTvl,
    SupportedDex,
    WhitelistedErc20TokenAmount,
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
    supportsFetchAllPools: boolean;
    logo: FunctionComponent<SVGIcon>;
}

export enum RestrictionType {
    blacklist = "blacklist",
    whitelist = "whitelist",
}

export enum RewardType {
    points = "points",
    tokens = "tokens",
}

export interface CampaignPayload {
    network?: number;
    rewardType?: RewardType;
    dex?: DexInfo;
    pool?: PoolWithTvl;
    startDate?: Dayjs;
    endDate?: Dayjs;
    points?: number;
    tokens?: WhitelistedErc20TokenAmount[];
    feeToken?: WhitelistedErc20TokenAmount;
    kpiSpecification?: KpiSpecification;
    restrictions?: {
        type: RestrictionType;
        list: Address[];
    };
}

export interface CampaignPayloadErrors {
    pool?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    kpiSpecification?: boolean;
    restrictions?: boolean;
}

export type DexInfo = Pick<
    Dex,
    "slug" | "name" | "logo" | "supportsFetchAllPools"
>;

export type CampaignPayloadPart = PropertyUnion<CampaignPayload>;

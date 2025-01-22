import {
    Campaign,
    type SupportedLiquityV2Brand,
    type TargetType,
    type AmmPool,
    type AmmPoolLiquidityTarget,
    type DistributablesType,
    type KpiSpecification,
    type LiquityV2DebtTarget,
    type PointDistributables,
    type SupportedDex,
    type TokenDistributables,
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
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

// TODO: have a common type for both this and dex, like protocols?
export interface LiquityV2Brand {
    slug: SupportedLiquityV2Brand;
    name: string;
    logo: FunctionComponent<SVGIcon>;
}

export enum RestrictionType {
    Blacklist = "blacklist",
    Whitelist = "whitelist",
}

export enum RewardType {
    Points = "points",
    Tokens = "tokens",
}

export interface WhitelistedErc20TokenAmount {
    token: WhitelistedErc20Token;
    amount: UsdPricedOnChainAmount;
}

export interface AugmentedPriceRangeBound {
    tick: number;
    price: number;
}

export interface AugmentedPriceRangeSpecification {
    token0To1: boolean;
    from: AugmentedPriceRangeBound;
    to: AugmentedPriceRangeBound;
}

export interface BaseCampaignPayload {
    rewardType?: RewardType;
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

export interface AmmPoolLiquidityCampaignPayload extends BaseCampaignPayload {
    dex?: DexInfo;
    pool?: AmmPool;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
}

export enum LiquityV2Action {
    Debt = "debt",
    Collateral = "collateral",
    StabilityPool = "stabilty-pool",
}

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2BrandInfo;
    action?: LiquityV2Action;
    collaterals?: Address[];
}

// export interface CampaignPayload {
//     // TODO: improve type and remove the unnecessary top level fields
//     targetType?: TargetType;
//     rewardType?: RewardType;
//     protocol?: string;
//     target?: CampaignTarget;
//     startDate?: Dayjs;
//     endDate?: Dayjs;
//     points?: number;
//     tokens?: WhitelistedErc20TokenAmount[];
//     fee?: WhitelistedErc20TokenAmount;
//     kpiSpecification?: KpiSpecification;
//     priceRangeSpecification?: AugmentedPriceRangeSpecification;
//     restrictions?: {
//         type: RestrictionType;
//         list: Address[];
//     };
// }

// export interface TargetedCampaignPayload<T extends TargetType>
//     extends CampaignPayload {
//     target?: T extends TargetType.AmmPoolLiquidity
//         ? AmmPoolLiquidityTarget
//         : T extends TargetType.LiquityV2Debt
//           ? LiquityV2DebtTarget
//           : never;
// }

export interface CampaignPreviewTokenDistributables {
    type: DistributablesType.Tokens;
    tokens: [WhitelistedErc20TokenAmount, ...WhitelistedErc20TokenAmount[]];
}

export interface CampaignPreviewPointDistributables {
    type: DistributablesType.Points;
    fee: WhitelistedErc20TokenAmount;
    points: number;
}

export class BaseCampaignPreviewPayload {
    constructor(
        public readonly startDate: Dayjs,
        public readonly endDate: Dayjs,
        public readonly distributables:
            | CampaignPreviewTokenDistributables
            | CampaignPreviewPointDistributables,
        public readonly kpiSpecification?: KpiSpecification,
        public readonly restrictions?: {
            type: RestrictionType;
            list: Address[];
        },
    ) {}

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesCampaignPreviewPayload<T> {
        return this.distributables.type === type;
    }
}

export class AmmPoolLiquidityCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly dex: DexInfo,
        public readonly pool: AmmPool,
        public readonly priceRangeSpecification?: AugmentedPriceRangeSpecification,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }
}

export class LiquityV2CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly brand: LiquityV2BrandInfo,
        public readonly action: string,
        public readonly collaterals: Address[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }
}

export type CampaignPreviewPayload =
    | AmmPoolLiquidityCampaignPreviewPayload
    | LiquityV2CampaignPreviewPayload;

export interface DistributablesCampaignPreviewPayload<
    T extends DistributablesType,
> extends BaseCampaignPreviewPayload {
    distributables: T extends DistributablesType.Tokens
        ? CampaignPreviewTokenDistributables
        : T extends DistributablesType.Points
          ? CampaignPreviewPointDistributables
          : never;
}

export interface TargetedCampaignPreviewPayload<T extends TargetType>
    extends BaseCampaignPreviewPayload {
    target: T extends TargetType.AmmPoolLiquidity
        ? AmmPoolLiquidityTarget
        : T extends TargetType.LiquityV2Debt
          ? LiquityV2DebtTarget
          : never;
}

export interface CampaignPayloadErrors {
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    kpiSpecification?: boolean;
    priceRangeSpecification?: boolean;
    restrictions?: boolean;
}

export type DexInfo = Pick<Dex, "slug" | "name" | "logo">;
export type LiquityV2BrandInfo = Pick<LiquityV2Brand, "slug" | "name" | "logo">;

export type BaseCampaignPayloadPart = PropertyUnion<BaseCampaignPayload>;

export type AmmPoolLiquidityCampaignPayloadPart =
    PropertyUnion<AmmPoolLiquidityCampaignPayload>;
export type LiquityV2CampaignPayloadPart =
    PropertyUnion<LiquityV2CampaignPayload>;

// export type TargetedCampaignPayloadPart<T extends TargetType> = PropertyUnion<
//     Partial<TargetedCampaignPayload<T>>
// >;

export class NamedCampaign extends Campaign {
    constructor(
        campaign: Campaign,
        public readonly name: string,
    ) {
        super(
            campaign.chainId,
            campaign.id,
            campaign.from,
            campaign.to,
            campaign.createdAt,
            campaign.target,
            campaign.distributables,
            campaign.snapshottedAt,
            campaign.specification,
            campaign.apr,
        );
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesNamedCampaign<T> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(
        type: T,
    ): this is TargetedNamedCampaign<T> {
        return this.target.type === type;
    }
}

export interface DistributablesNamedCampaign<T extends DistributablesType>
    extends NamedCampaign {
    distributables: T extends DistributablesType.Tokens
        ? TokenDistributables
        : T extends DistributablesType.Points
          ? PointDistributables
          : never;
}

export interface TargetedNamedCampaign<T extends TargetType>
    extends NamedCampaign {
    target: T extends TargetType.AmmPoolLiquidity
        ? AmmPoolLiquidityTarget
        : T extends TargetType.LiquityV2Debt
          ? LiquityV2DebtTarget
          : never;
}

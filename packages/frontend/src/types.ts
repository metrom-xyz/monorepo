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

export enum ProtocolType {
    Dex = "dex",
    LiquityV2Brand = "liquity-v2-brand",
}

export interface Dex {
    slug: SupportedDex;
    name: string;
    addLiquidityUrl: string;
    supportsFetchAllPools: boolean;
    logo: FunctionComponent<SVGIcon>;
}

export interface LiquityV2Brand {
    slug: SupportedLiquityV2Brand;
    name: string;
    actionUrls: Record<
        | TargetType.LiquityV2Debt
        | TargetType.LiquityV2Collateral
        | TargetType.LiquityV2StabilityPool,
        string
    >;
    logo: FunctionComponent<SVGIcon>;
}

export interface Protocols {
    [ProtocolType.Dex]: Dex[];
    [ProtocolType.LiquityV2Brand]: LiquityV2Brand[];
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

export enum CampaignKind {
    AmmPoolLiquidity = 1,
    LiquityV2Debt = 2,
    LiquityV2Collateral = 3,
    LiquityV2StabilityPool = 4,
}

export enum LiquityV2Action {
    Debt = "debt",
    Collateral = "collateral",
    StabilityPool = "stabilty-pool",
}

export interface BaseCampaignPayload {
    rewardType?: RewardType;
    startDate?: Dayjs;
    endDate?: Dayjs;
    points?: number;
    tokens?: WhitelistedErc20TokenAmount[];
    fee?: WhitelistedErc20TokenAmount;
    kpiSpecification?: KpiSpecification;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
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

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2BrandInfo;
    action?: LiquityV2Action;
    collaterals?: Address[];
}

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
    public readonly kind: CampaignKind = CampaignKind.AmmPoolLiquidity;
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
    public readonly kind: CampaignKind;

    constructor(
        public readonly brand: LiquityV2BrandInfo,
        public readonly action: LiquityV2Action,
        public readonly collaterals: Address[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        switch (action) {
            case LiquityV2Action.StabilityPool:
                this.kind = CampaignKind.LiquityV2StabilityPool;
            case LiquityV2Action.Collateral:
                this.kind = CampaignKind.LiquityV2Collateral;
            case LiquityV2Action.Debt:
                this.kind = CampaignKind.LiquityV2Debt;
        }
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
    pool?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    kpiSpecification?: boolean;
    priceRangeSpecification?: boolean;
    restrictions?: boolean;
}

export type DexInfo = Pick<
    Dex,
    "slug" | "name" | "logo" | "supportsFetchAllPools"
>;
export type LiquityV2BrandInfo = Pick<LiquityV2Brand, "slug" | "name" | "logo">;

export type BaseCampaignPayloadPart = PropertyUnion<BaseCampaignPayload>;

export type AmmPoolLiquidityCampaignPayloadPart =
    PropertyUnion<AmmPoolLiquidityCampaignPayload>;

export type LiquityV2CampaignPayloadPart =
    PropertyUnion<LiquityV2CampaignPayload>;

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

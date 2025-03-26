import {
    Campaign as SdkCampaign,
    Status,
    TargetType,
    type SupportedLiquityV2,
    type AmmPoolWithTvl,
    type AmmPoolLiquidityTarget,
    type DistributablesType,
    type KpiSpecification,
    type LiquityV2DebtTarget,
    type PointDistributables,
    type SupportedDex,
    type TokenDistributables,
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
    type LiquityV2Collateral,
    type Erc20Token,
    type LiquityV2StabilityPoolTarget,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { SVGProps, FunctionComponent } from "react";
import type { Address } from "viem";
import type { ChainData } from "../commons";
import type {
    Messages,
    NamespaceKeys,
    NestedKeyOf,
    useTranslations,
} from "next-intl";
import type { getTranslations } from "next-intl/server";

export enum Theme {
    System = "system",
    Dark = "dark",
    Light = "light",
}

export enum FilterableStatus {
    All = "",
    Live = Status.Live,
    Upcoming = Status.Upcoming,
    Ended = Status.Ended,
}

export type TranslationsType<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> =
    | Awaited<ReturnType<typeof getTranslations<T>>>
    | ReturnType<typeof useTranslations<T>>;

export type TranslationsKeys<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = Parameters<TranslationsType<T>>[0];

export type LocalizedMessage<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = TranslationsKeys<T> | "";

type PropertyUnion<T> = {
    [K in keyof T]: { [P in K]: T[K] };
}[keyof T];
export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export enum ProtocolType {
    Dex = "dex",
    LiquityV2 = "liquity-v2",
}

export interface ProtocolBase<S = string> {
    slug: S;
    name: string;
    logo: FunctionComponent<SVGIcon>;
}

export enum DepositUrlType {
    PathPoolAddress = "path-pool-address",
    PathTokenAddresses = "path-token-addresses",
    QueryTokenAddresses = "query-pool-addresses",
}

export interface DexProtocol extends ProtocolBase<SupportedDex> {
    type: ProtocolType.Dex;
    depositUrl: {
        type: DepositUrlType;
        template: string;
    };
    supportsFetchAllPools: boolean;
}

export interface LiquityV2Protocol extends ProtocolBase<SupportedLiquityV2> {
    type: ProtocolType.LiquityV2;
    debtToken: Erc20Token;
    actionUrls: Record<
        TargetType.LiquityV2Debt | TargetType.LiquityV2StabilityPool,
        string
    >;
}

export type Protocol = DexProtocol | LiquityV2Protocol;

export enum CampaignType {
    LiquityV2 = "liquity-v2",
    AmmPoolLiquidity = "amm-pool-liquidity",
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
    LiquityV2StabilityPool = 3,
}

export enum LiquityV2Action {
    Debt = "debt",
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
    dex?: DexProtocol;
    pool?: AmmPoolWithTvl;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
}

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2Protocol;
    action?: LiquityV2Action;
    collateral?: LiquityV2Collateral;
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
        public readonly dex: DexProtocol,
        public readonly pool: AmmPoolWithTvl,
        public readonly priceRangeSpecification?: AugmentedPriceRangeSpecification,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }
}

export class LiquityV2CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind;

    constructor(
        public readonly brand: LiquityV2Protocol,
        public readonly action: LiquityV2Action,
        public readonly collateral: LiquityV2Collateral,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        switch (action) {
            case LiquityV2Action.StabilityPool: {
                this.kind = CampaignKind.LiquityV2StabilityPool;
                break;
            }
            case LiquityV2Action.Debt: {
                this.kind = CampaignKind.LiquityV2Debt;
                break;
            }
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
          : T extends TargetType.LiquityV2StabilityPool
            ? LiquityV2StabilityPoolTarget
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

export type BaseCampaignPayloadPart = PropertyUnion<BaseCampaignPayload>;

export type AmmPoolLiquidityCampaignPayloadPart =
    PropertyUnion<AmmPoolLiquidityCampaignPayload>;

export type LiquityV2CampaignPayloadPart =
    PropertyUnion<LiquityV2CampaignPayload>;

export class Campaign extends SdkCampaign {
    constructor(
        campaign: SdkCampaign,
        public readonly chainData: ChainData,
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

    getDepositLiquidityUrl(): string | undefined {
        if (!this.isTargeting(TargetType.AmmPoolLiquidity)) return undefined;

        const pool = this.target.pool;
        const dex = this.chainData.protocols.find(
            (protocol) =>
                protocol.type === ProtocolType.Dex &&
                protocol.slug === pool.dex.slug,
        );

        if (!dex) return undefined;
        const { depositUrl } = dex as DexProtocol;
        const { template, type } = depositUrl;

        switch (type) {
            case DepositUrlType.PathPoolAddress: {
                return template.replace("{pool}", `${pool.id}`);
            }
            case DepositUrlType.PathTokenAddresses: {
                return template.replace(
                    "{pool}",
                    `${pool.tokens.map(({ address }) => address).join("/")}`,
                );
            }
            case DepositUrlType.QueryTokenAddresses: {
                const url = template
                    .replace("{token_0}", pool.tokens[0].address)
                    .replace("{token_1}", pool.tokens[1].address);

                return pool.fee ? `${url}&fee=${pool.fee * 10000}` : url;
            }
            default: {
                return undefined;
            }
        }
    }
}

export interface DistributablesNamedCampaign<T extends DistributablesType>
    extends Campaign {
    distributables: T extends DistributablesType.Tokens
        ? TokenDistributables
        : T extends DistributablesType.Points
          ? PointDistributables
          : never;
}

export interface TargetedNamedCampaign<T extends TargetType> extends Campaign {
    target: T extends TargetType.AmmPoolLiquidity
        ? AmmPoolLiquidityTarget
        : T extends TargetType.LiquityV2Debt
          ? LiquityV2DebtTarget
          : T extends TargetType.LiquityV2StabilityPool
            ? LiquityV2StabilityPoolTarget
            : never;
}

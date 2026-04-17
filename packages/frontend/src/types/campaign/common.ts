import {
    CampaignKind,
    BaseCampaign as SdkBaseCampaign,
    Campaign as SdkCampaign,
    CampaignDetails as SdkCampaignDetails,
    CampaignItem as SdkCampaignItem,
    CampaignItemDetails as SdkCampaignItemDetails,
    TargetType,
    type Claim,
    type OnChainAmount,
    type Reimbursement,
    type Restrictions,
    type UsdPricedErc20TokenAmount,
    type UsdPricedOnChainAmount,
    type DistributablesType,
    type TokenDistributables,
    type BaseTargetedCampaign,
    type FixedPointDistributables,
    type DynamicPointDistributables,
    type Specification,
    SpecificationDistributionType,
    type RangePoolTvlKpiGoal,
    type FixedDistributionSpecification,
    type KpiDistributionSpecification,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";
import { type WhitelistedErc20TokenAmount } from "../common";
import {
    DepositUrlType,
    ProtocolType,
    type ChainData,
    type DexProtocol,
} from "@metrom-xyz/chains";
import type { PropertyUnion } from "../utils";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPreviewPayload,
} from "./amm-pool-liquidity-campaign";
import type {
    LiquityV2CampaignPayload,
    LiquityV2CampaignPreviewPayload,
} from "./liquity-v2-campaign";
import type {
    AaveV3CampaignPayload,
    AaveV3CampaignPreviewPayload,
} from "./aave-v3-campaign";
import type { EmptyTargetCampaignPreviewPayload } from "./empty-target-campaign";

export interface ClaimWithRemaining extends Claim {
    remaining: UsdPricedOnChainAmount;
}

export interface ReimbursementsWithRemaining extends Reimbursement {
    remaining: UsdPricedOnChainAmount;
}

export type Erc20TokenAmountWithAllowance = UsdPricedErc20TokenAmount & {
    allowance: bigint;
    approving: boolean;
    approved: boolean;
};

export interface Rank {
    account: Address;
    weight: number;
    position: number;
    usdValue: number | null;
    distributed: OnChainAmount | UsdPricedErc20TokenAmount[] | number;
}

export interface Leaderboard {
    timestamp?: number;
    connectedAccountRank?: Rank;
    sortedRanks: Rank[];
}

export interface CampaignPayloadKpiDistribution {
    minimumPayoutPercentage?: number;
    goal?: Partial<RangePoolTvlKpiGoal>;
}

export interface CampaignPayloadFixedDistribution {
    apr?: number;
}

export interface CampaignPreviewKpiDistribution {
    minimumPayoutPercentage?: number;
    goal: RangePoolTvlKpiGoal;
}

export interface CampaignPreviewFixedDistribution {
    apr: number;
}

export interface BaseCampaignPayload {
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    kind?: CampaignKind;
    distributables?: CampaignPayloadDistributables;
    kpiDistribution?: CampaignPayloadKpiDistribution;
    fixedDistribution?: CampaignPayloadFixedDistribution;
    restrictions?: Restrictions;
}

export interface CampaignPayloadTokenDistributables {
    type: DistributablesType.Tokens;
    tokens?: WhitelistedErc20TokenAmount[];
}

export interface CampaignPayloadFixedPointDistributables {
    type: DistributablesType.FixedPoints;
    fee?: WhitelistedErc20TokenAmount;
    points?: number;
}

export interface CampaignPayloadDynamicPointDistributables {
    type: DistributablesType.DynamicPoints;
    // TODO: implement for dynamic points
}

// Needed to support Turtle campaigns
export interface CampaignPayloadNoDistributables {
    type: DistributablesType.NoDistributables;
}

export interface CampaignPreviewTokenDistributables {
    type: DistributablesType.Tokens;
    tokens: [WhitelistedErc20TokenAmount, ...WhitelistedErc20TokenAmount[]];
}

export interface CampaignPreviewFixedPointDistributables {
    type: DistributablesType.FixedPoints;
    fee: WhitelistedErc20TokenAmount;
    points: number;
}

export interface CampaignPreviewDynamicPointDistributables {
    type: DistributablesType.DynamicPoints;
    // TODO: implement for dynamic points
}

// Needed to support Turtle campaigns
export interface CampaignPreviewNoDistributables {
    type: DistributablesType.NoDistributables;
}

export type CampaignPayloadDistributables =
    | CampaignPayloadTokenDistributables
    | CampaignPayloadFixedPointDistributables
    | CampaignPayloadDynamicPointDistributables
    | CampaignPayloadNoDistributables;

export type CampaignPreviewDistributables =
    | CampaignPreviewTokenDistributables
    | CampaignPreviewFixedPointDistributables
    | CampaignPreviewDynamicPointDistributables
    | CampaignPreviewNoDistributables;

export interface TargetValue {
    usd: number;
    raw?: bigint;
}

export abstract class BaseCampaignPreviewPayload {
    constructor(
        public readonly chainId: number,
        public readonly startDate: Dayjs,
        public readonly endDate: Dayjs,
        public readonly distributables: CampaignPreviewDistributables,
        public readonly kpiDistribution?: CampaignPreviewKpiDistribution,
        public readonly fixedDistribution?: CampaignPreviewFixedDistribution,
        public readonly restrictions?: Restrictions,
    ) {}

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesCampaignPreviewPayload<T> {
        return this.distributables.type === type;
    }

    abstract getTargetValue(): TargetValue | undefined;
}

export type CampaignPreviewPayload =
    | AmmPoolLiquidityCampaignPreviewPayload
    | LiquityV2CampaignPreviewPayload
    | AaveV3CampaignPreviewPayload
    | EmptyTargetCampaignPreviewPayload;

export type CampaignPayload =
    | AmmPoolLiquidityCampaignPayload
    | LiquityV2CampaignPayload
    | AaveV3CampaignPayload;

export interface DistributablesCampaignPreviewPayload<
    T extends DistributablesType,
> extends BaseCampaignPreviewPayload {
    distributables: T extends DistributablesType.Tokens
        ? CampaignPreviewTokenDistributables
        : T extends DistributablesType.FixedPoints
          ? CampaignPreviewFixedPointDistributables
          : T extends DistributablesType.DynamicPoints
            ? CampaignPreviewDynamicPointDistributables
            : never;
}

export interface CampaignPayloadErrors {
    basics?: string;
    rewards?: string;

    // TODO: remove single prop errors
    pool?: boolean;
    holdFungibleAsset?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    weighting?: boolean;
    distribution?: boolean;
    priceRangeSpecification?: boolean;
    boostingFactor?: boolean;
    blacklistedCrossSupplyCollaterals?: boolean;
    restrictions?: boolean;
}

export type BaseCampaignPayloadPart = PropertyUnion<BaseCampaignPayload>;

export type CampaignPayloadPart<T extends ProtocolType | undefined> =
    T extends ProtocolType.Dex
        ? Partial<AmmPoolLiquidityCampaignPayload>
        : T extends ProtocolType.LiquityV2
          ? Partial<LiquityV2CampaignPayload>
          : T extends ProtocolType.AaveV3
            ? Partial<AaveV3CampaignPayload>
            : never;

export class Campaign extends SdkCampaign {
    constructor(
        campaign: SdkCampaign,
        public readonly name: string,
        public readonly targetValueName: string,
        public readonly chainData?: ChainData,
    ) {
        super(
            campaign.opportunitiesAmount,
            campaign.hasKpi,
            campaign.id,
            campaign.chainType,
            campaign.chainId,
            campaign.from,
            campaign.to,
            campaign.createdAt,
            campaign.target,
            campaign.distributables,
            campaign.usdTvl,
            campaign.snapshottedAt,
            campaign.apr,
        );
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesNamedCampaign<T, this> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(
        type: T,
    ): this is TargetedNamedCampaign<T, this> {
        return this.target.type === type;
    }

    getDepositLiquidityUrl(
        params?: Record<string, string | number>,
    ): string | undefined {
        if (!this.isTargeting(TargetType.AmmPoolLiquidity)) return undefined;

        const pool = this.target.pool;
        const dex = this.chainData?.protocols.find(
            (protocol) =>
                protocol.type === ProtocolType.Dex &&
                protocol.slug === pool.dex.slug,
        );

        if (!dex) return undefined;
        const { depositUrl } = dex as DexProtocol;
        const { template, type } = depositUrl;
        const queryParams = params
            ? Object.entries(params)
                  .map(([key, value]) => `&${key}=${value}`)
                  .join("")
            : "";

        switch (type) {
            case DepositUrlType.PathPoolAddress: {
                return template
                    .replace("{pool}", `${pool.id}`)
                    .concat(queryParams);
            }
            case DepositUrlType.PathTokenAddresses: {
                return template
                    .replace(
                        "{pool}",
                        `${pool.tokens.map(({ address }) => address).join("/")}`,
                    )
                    .concat(queryParams);
            }
            case DepositUrlType.QueryTokenAddresses: {
                const url = template
                    .replace("{token_0}", pool.tokens[0].address)
                    .replace("{token_1}", pool.tokens[1].address)
                    .concat(queryParams);

                return pool.fee ? `${url}&fee=${pool.fee * 10000}` : url;
            }
            default: {
                return undefined;
            }
        }
    }
}

export class CampaignDetails extends SdkCampaignDetails {
    constructor(
        campaignDetails: SdkCampaignDetails,
        public readonly name: string,
        public readonly targetValueName: string,
        public readonly chainData?: ChainData,
    ) {
        super(
            campaignDetails.opportunitiesAmount,
            campaignDetails.hasKpi,
            campaignDetails.accountsIncentivized,
            campaignDetails.id,
            campaignDetails.chainType,
            campaignDetails.chainId,
            campaignDetails.from,
            campaignDetails.to,
            campaignDetails.createdAt,
            campaignDetails.target,
            campaignDetails.distributables,
            campaignDetails.usdTvl,
            campaignDetails.snapshottedAt,
            campaignDetails.apr,
        );
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesNamedCampaign<T, this> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(
        type: T,
    ): this is TargetedNamedCampaign<T, this> {
        return this.target.type === type;
    }

    getDepositLiquidityUrl(
        params?: Record<string, string | number>,
    ): string | undefined {
        if (!this.isTargeting(TargetType.AmmPoolLiquidity)) return undefined;

        const pool = this.target.pool;
        const dex = this.chainData?.protocols.find(
            (protocol) =>
                protocol.type === ProtocolType.Dex &&
                protocol.slug === pool.dex.slug,
        );

        if (!dex) return undefined;
        const { depositUrl } = dex as DexProtocol;
        const { template, type } = depositUrl;
        const queryParams = params
            ? Object.entries(params)
                  .map(([key, value]) => `&${key}=${value}`)
                  .join("")
            : "";

        switch (type) {
            case DepositUrlType.PathPoolAddress: {
                return template
                    .replace("{pool}", `${pool.id}`)
                    .concat(queryParams);
            }
            case DepositUrlType.PathTokenAddresses: {
                return template
                    .replace(
                        "{pool}",
                        `${pool.tokens.map(({ address }) => address).join("/")}`,
                    )
                    .concat(queryParams);
            }
            case DepositUrlType.QueryTokenAddresses: {
                const url = template
                    .replace("{token_0}", pool.tokens[0].address)
                    .replace("{token_1}", pool.tokens[1].address)
                    .concat(queryParams);

                return pool.fee ? `${url}&fee=${pool.fee * 10000}` : url;
            }
            default: {
                return undefined;
            }
        }
    }
}

export class CampaignItem extends SdkCampaignItem {
    constructor(
        campaignItem: SdkCampaignItem,
        public readonly name: string,
        public readonly targetValueName: string,
        public readonly chainData?: ChainData,
    ) {
        super(
            campaignItem.specification,
            campaignItem.restrictions,
            campaignItem.accountsIncentivized,
            campaignItem.id,
            campaignItem.chainType,
            campaignItem.chainId,
            campaignItem.from,
            campaignItem.to,
            campaignItem.createdAt,
            campaignItem.target,
            campaignItem.distributables,
            campaignItem.usdTvl,
            campaignItem.snapshottedAt,
            campaignItem.apr,
        );
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesNamedCampaign<T, this> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(
        type: T,
    ): this is TargetedNamedCampaign<T, this> {
        return this.target.type === type;
    }

    hasKpiDistribution(): this is this & {
        specification: Specification & {
            distribution: KpiDistributionSpecification;
        };
    } {
        return (
            this.specification?.distribution?.type ===
            SpecificationDistributionType.Kpi
        );
    }

    hasFixedDistribution(): this is this & {
        specification: Specification & {
            distribution: FixedDistributionSpecification;
        };
    } {
        return (
            this.specification?.distribution?.type ===
            SpecificationDistributionType.Fixed
        );
    }
}

export class CampaignItemDetails extends SdkCampaignItemDetails {
    // To avoid having to define another campaign item type
    public readonly opportunitiesAmount = 0;

    constructor(
        campaignItemDetails: SdkCampaignItemDetails,
        public readonly name: string,
        public readonly targetValueName: string,
        public readonly chainData?: ChainData,
    ) {
        super(
            campaignItemDetails.specification,
            campaignItemDetails.restrictions,
            campaignItemDetails.accountsIncentivized,
            campaignItemDetails.id,
            campaignItemDetails.chainType,
            campaignItemDetails.chainId,
            campaignItemDetails.from,
            campaignItemDetails.to,
            campaignItemDetails.createdAt,
            campaignItemDetails.target,
            campaignItemDetails.distributables,
            campaignItemDetails.usdTvl,
            campaignItemDetails.snapshottedAt,
            campaignItemDetails.apr,
        );
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesNamedCampaign<T, this> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(
        type: T,
    ): this is TargetedNamedCampaign<T, this> {
        return this.target.type === type;
    }

    hasKpiDistribution(): this is this & {
        specification: Specification & {
            distribution: KpiDistributionSpecification;
        };
    } {
        return (
            this.specification?.distribution?.type ===
            SpecificationDistributionType.Kpi
        );
    }

    hasFixedDistribution(): this is this & {
        specification: Specification & {
            distribution: FixedDistributionSpecification;
        };
    } {
        return (
            this.specification?.distribution?.type ===
            SpecificationDistributionType.Fixed
        );
    }

    getDepositLiquidityUrl(
        params?: Record<string, string | number>,
    ): string | undefined {
        if (!this.isTargeting(TargetType.AmmPoolLiquidity)) return undefined;

        const pool = this.target.pool;
        const dex = this.chainData?.protocols.find(
            (protocol) =>
                protocol.type === ProtocolType.Dex &&
                protocol.slug === pool.dex.slug,
        );

        if (!dex) return undefined;
        const { depositUrl } = dex as DexProtocol;
        const { template, type } = depositUrl;
        const queryParams = params
            ? Object.entries(params)
                  .map(([key, value]) => `&${key}=${value}`)
                  .join("")
            : "";

        switch (type) {
            case DepositUrlType.PathPoolAddress: {
                return template
                    .replace("{pool}", `${pool.id}`)
                    .concat(queryParams);
            }
            case DepositUrlType.PathTokenAddresses: {
                return template
                    .replace(
                        "{pool}",
                        `${pool.tokens.map(({ address }) => address).join("/")}`,
                    )
                    .concat(queryParams);
            }
            case DepositUrlType.QueryTokenAddresses: {
                const url = template
                    .replace("{token_0}", pool.tokens[0].address)
                    .replace("{token_1}", pool.tokens[1].address)
                    .concat(queryParams);

                return pool.fee ? `${url}&fee=${pool.fee * 10000}` : url;
            }
            default: {
                return undefined;
            }
        }
    }
}

export type DistributablesNamedCampaign<
    T extends DistributablesType,
    C extends SdkBaseCampaign,
> = C & {
    distributables: T extends DistributablesType.Tokens
        ? TokenDistributables
        : T extends DistributablesType.FixedPoints
          ? FixedPointDistributables
          : T extends DistributablesType.DynamicPoints
            ? DynamicPointDistributables
            : never;
};

export type TargetedNamedCampaign<
    T extends TargetType,
    C extends SdkBaseCampaign,
> = C & BaseTargetedCampaign<T>;

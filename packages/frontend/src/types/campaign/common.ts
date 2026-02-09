import {
    CampaignKind,
    Campaign as SdkCampaign,
    TargetType,
    type Claim,
    type OnChainAmount,
    type Reimbursement,
    type Restrictions,
    type UsdPricedErc20TokenAmount,
    type UsdPricedOnChainAmount,
    type DistributablesType,
    type KpiSpecification,
    type TokenDistributables,
    type BaseTargetedCampaign,
    type FixedPointDistributables,
    type DynamicPointDistributables,
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
    chainId?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
    kind?: CampaignKind;
    distributables?: CampaignPayloadDistributables;
    kpiSpecification?: KpiSpecification;
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
        public readonly kpiSpecification?: KpiSpecification,
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
    pool?: boolean;
    holdFungibleAsset?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    weighting?: boolean;
    kpiSpecification?: boolean;
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
            campaign.chainId,
            campaign.chainType,
            campaign.id,
            campaign.from,
            campaign.to,
            campaign.createdAt,
            campaign.target,
            campaign.distributables,
            campaign.snapshottedAt,
            campaign.specification,
            campaign.usdTvl,
            campaign.apr,
            campaign.restrictions,
            campaign.accountsIncentivized,
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

export interface DistributablesNamedCampaign<
    T extends DistributablesType,
> extends Campaign {
    distributables: T extends DistributablesType.Tokens
        ? TokenDistributables
        : T extends DistributablesType.FixedPoints
          ? FixedPointDistributables
          : T extends DistributablesType.DynamicPoints
            ? DynamicPointDistributables
            : never;
}

export type TargetedNamedCampaign<T extends TargetType> =
    BaseTargetedCampaign<T> & Campaign;

import {
    CampaignKind,
    Campaign as SdkCampaign,
    TargetType,
    type Claim,
    type AaveV3Collateral,
    type AaveV3Market,
    type OnChainAmount,
    type Reimbursement,
    type Restrictions,
    type UsdPricedErc20TokenAmount,
    type UsdPricedOnChainAmount,
    type Weighting,
    type DistributablesType,
    type KpiSpecification,
    type TokenDistributables,
    type LiquityV2Collateral,
    type BaseTargetedCampaign,
    type FungibleAssetInfo,
    type FixedPointDistributables,
    type DynamicPointDistributables,
    type AmmPool,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";
import { type WhitelistedErc20TokenAmount } from "./common";
import {
    DepositUrlType,
    ProtocolType,
    type AaveV3Protocol,
    type ChainData,
    type DexProtocol,
    type LiquityV2Protocol,
} from "@metrom-xyz/chains";
import type { PropertyUnion } from "./utils";

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
    kind?: CampaignKind;
    startDate?: Dayjs;
    endDate?: Dayjs;
    distributables?: CampaignPayloadDistributables;
    kpiSpecification?: KpiSpecification;
    restrictions?: Restrictions;
}

export interface AmmPoolLiquidityCampaignPayload extends BaseCampaignPayload {
    dex?: DexProtocol;
    pool?: AmmPool;
    weighting?: Weighting;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
}

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2Protocol;
    collateral?: LiquityV2Collateral;
}

export interface AaveV3CampaignPayload extends BaseCampaignPayload {
    brand?: AaveV3Protocol;
    market?: AaveV3Market;
    collateral?: AaveV3Collateral;
    boostingFactor?: number;
    blacklistedCollaterals?: AaveV3Collateral[];
}

export interface HoldFungibleAssetCampaignPayload extends BaseCampaignPayload {
    asset?: FungibleAssetInfo;
    stakingAssets: FungibleAssetInfo[];
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

export type CampaignPayloadDistributables =
    | CampaignPayloadTokenDistributables
    | CampaignPayloadFixedPointDistributables
    | CampaignPayloadDynamicPointDistributables;

export type CampaignPreviewDistributables =
    | CampaignPreviewTokenDistributables
    | CampaignPreviewFixedPointDistributables
    | CampaignPreviewDynamicPointDistributables;

export interface TargetValue {
    usd: number;
    raw?: bigint;
}

export abstract class BaseCampaignPreviewPayload {
    constructor(
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

export class AmmPoolLiquidityCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly dex: DexProtocol,
        public readonly pool: AmmPool,
        public readonly weighting?: Weighting,
        public readonly priceRangeSpecification?: AugmentedPriceRangeSpecification,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.AmmPoolLiquidity &&
            kind !== CampaignKind.JumperWhitelistedAmmPoolLiquidity
        )
            throw new Error(
                `Unsupported kind ${kind} for amm pool liquidity campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        return { usd: this.pool.usdTvl, raw: this.pool.liquidity };
    }
}

export class LiquityV2CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly brand: LiquityV2Protocol,
        public readonly collateral: LiquityV2Collateral,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.LiquityV2Debt &&
            kind !== CampaignKind.LiquityV2StabilityPool
        )
            throw new Error(
                `Unsupported kind ${kind} for liquity-v2 campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        if (this.kind === CampaignKind.LiquityV2Debt)
            return {
                usd: this.collateral.usdMintedDebt,
                raw: this.collateral.liquidity,
            };
        if (this.kind === CampaignKind.LiquityV2StabilityPool)
            return {
                usd: this.collateral.usdStabilityPoolDebt,
                raw: this.collateral.liquidity,
            };

        return undefined;
    }
}

export class AaveV3CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly brand: AaveV3Protocol,
        public readonly market: AaveV3Market,
        public readonly collateral: AaveV3Collateral,
        public readonly boostingFactor?: number,
        public readonly blacklistedCollaterals?: AaveV3Collateral[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.AaveV3Borrow &&
            kind !== CampaignKind.AaveV3Supply &&
            kind !== CampaignKind.AaveV3NetSupply &&
            kind !== CampaignKind.AaveV3BridgeAndSupply
        )
            throw new Error(
                `Unsupported kind ${kind} for aave-v3 campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        if (this.kind === CampaignKind.AaveV3Borrow)
            return { usd: this.collateral.usdDebt, raw: this.collateral.debt };

        return {
            usd: this.collateral.usdSupply,
            raw: this.collateral.supply,
        };
    }
}

export class HoldFungibleAssetCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.HoldFungibleAsset;
    constructor(
        public readonly asset: FungibleAssetInfo,
        public readonly stakingAssets: FungibleAssetInfo[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }

    getTargetValue(): TargetValue | undefined {
        return { usd: this.asset.usdTotalSupply, raw: this.asset.totalSupply };
    }
}

export class EmptyTargetCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.EmptyTarget;
    constructor(
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }

    getTargetValue(): TargetValue | undefined {
        return undefined;
    }
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

export type AmmPoolLiquidityCampaignPayloadPart =
    PropertyUnion<AmmPoolLiquidityCampaignPayload>;

export type LiquityV2CampaignPayloadPart =
    PropertyUnion<LiquityV2CampaignPayload>;

export type AaveV3CampaignPayloadPart = PropertyUnion<AaveV3CampaignPayload>;

export type HoldFungibleAssetCampaignPayloadPart =
    PropertyUnion<HoldFungibleAssetCampaignPayload>;

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

    getTargetUsdValue(): number | undefined {
        // TODO: remove the method which is useless at this point
        return this.usdTvl;
        // switch (this.target.type) {
        //     case TargetType.AmmPoolLiquidity:
        //     case TargetType.JumperWhitelistedAmmPoolLiquidity:
        //         return this.target.pool.usdTvl;
        //     case TargetType.LiquityV2Debt:
        //         return this.target.collateral.usdMintedDebt;
        //     case TargetType.LiquityV2StabilityPool:
        //         return this.target.collateral.usdStabilityPoolDebt;
        //     case TargetType.AaveV3Borrow:
        //         return this.target.collateral.usdDebt;
        //     case TargetType.AaveV3BridgeAndSupply:
        //     case TargetType.AaveV3Supply:
        //         return this.target.collateral.usdSupply;
        //     case TargetType.AaveV3NetSupply:
        //         return this.target.collateral.usdNetSupply;
        //     default:
        //         return undefined;
        // }
    }

    getTargetRawValue(): bigint | undefined {
        // TODO: remove this if not needed anymore
        return undefined;
        // switch (this.target.type) {
        //     case TargetType.AmmPoolLiquidity:
        //     case TargetType.JumperWhitelistedAmmPoolLiquidity:
        //         return this.target.pool.liquidity;
        //     case TargetType.LiquityV2Debt:
        //         return this.target.collateral.liquidity;
        //     case TargetType.LiquityV2StabilityPool:
        //         return this.target.collateral.liquidity;
        //     case TargetType.AaveV3Borrow:
        //         return this.target.collateral.debt;
        //     case TargetType.AaveV3BridgeAndSupply:
        //     case TargetType.AaveV3Supply:
        //         return this.target.collateral.supply;
        //     case TargetType.AaveV3NetSupply:
        //         return this.target.collateral.netSupply;
        //     default:
        //         return undefined;
        // }
    }
}

export interface DistributablesNamedCampaign<T extends DistributablesType>
    extends Campaign {
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

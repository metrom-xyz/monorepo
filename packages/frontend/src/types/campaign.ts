import type {
    Claim,
    AaveV3BorrowTarget,
    AaveV3Collateral,
    AaveV3Market,
    AaveV3NetSupplyTarget,
    AaveV3SupplyTarget,
    OnChainAmount,
    Reimbursement,
    Restrictions,
    UsdPricedErc20TokenAmount,
    UsdPricedOnChainAmount,
    Weighting,
    EmptyTarget,
    AaveV3BridgeAndSupplyTarget,
    PartnerActionTargetType,
} from "@metrom-xyz/sdk";
import {
    Campaign as SdkCampaign,
    TargetType,
    type AmmPoolWithTvl,
    type AmmPoolLiquidityTarget,
    type DistributablesType,
    type KpiSpecification,
    type LiquityV2DebtTarget,
    type PointDistributables,
    type TokenDistributables,
    type LiquityV2Collateral,
    type LiquityV2StabilityPoolTarget,
} from "@metrom-xyz/sdk";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";
import { LiquityV2Action, type WhitelistedErc20TokenAmount } from "./common";
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

export enum CampaignKind {
    AmmPoolLiquidity = 1,
    LiquityV2Debt = 2,
    LiquityV2StabilityPool = 3,
    EmptyTarget = 5,
    AaveV3Supply = 6,
    AaveV3Borrow = 7,
    AaveV3NetSupply = 8,
    AaveV3BridgeAndSupply = 9,
    JumperWhitelistedAmmPoolLiquidity = 10,
}

export enum CampaignType {
    LiquityV2 = "liquity-v2",
    AmmPoolLiquidity = "amm-pool-liquidity",
    AaveV3 = "aave-v3",
    AaveV3BridgeAndSupply = "aave-v3-bridge-and-supply",
    JumperWhitelistedAmmPoolLiquidity = "jumper-whitelisted-amm-pool-liquidity",
    // Maybe we can avoid this type since it's used only in the route
    // PartnerAction = "partner-action",
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
    startDate?: Dayjs;
    endDate?: Dayjs;
    distributables?: CampaignPayloadDistributables;
    kpiSpecification?: KpiSpecification;
    restrictions?: Restrictions;
}

export interface AmmPoolLiquidityCampaignPayload extends BaseCampaignPayload {
    dex?: DexProtocol;
    pool?: AmmPoolWithTvl;
    weighting?: Weighting;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
}

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2Protocol;
    action?: LiquityV2Action;
    collateral?: LiquityV2Collateral;
}

export interface AaveV3CampaignPayload extends BaseCampaignPayload {
    brand?: AaveV3Protocol;
    action?: CampaignKind;
    market?: AaveV3Market;
    collateral?: AaveV3Collateral;
    boostingFactor?: number;
}

export interface CampaignPayloadTokenDistributables {
    type: DistributablesType.Tokens;
    tokens?: WhitelistedErc20TokenAmount[];
}

export interface CampaignPayloadPointDistributables {
    type: DistributablesType.Points;
    fee?: WhitelistedErc20TokenAmount;
    points?: number;
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

export type CampaignPayloadDistributables =
    | CampaignPayloadTokenDistributables
    | CampaignPayloadPointDistributables;

export type CampaignPreviewDistributables =
    | CampaignPreviewTokenDistributables
    | CampaignPreviewPointDistributables;

export class BaseCampaignPreviewPayload {
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
}

export class AmmPoolLiquidityCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly dex: DexProtocol,
        public readonly pool: AmmPoolWithTvl,
        public readonly weighting?: Weighting,
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
            default: {
                throw new Error(
                    `Unsupported action ${action} for liquity-v2 campaign payload`,
                );
            }
        }
    }
}

export class AaveV3CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind;

    constructor(
        public readonly brand: AaveV3Protocol,
        public readonly action: CampaignKind,
        public readonly market: AaveV3Market,
        public readonly collateral: AaveV3Collateral,
        public readonly boostingFactor?: number,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
        this.kind = action;
    }
}

// export class AaveV3BridgeAndSupplyCampaignPreviewPayload extends BaseCampaignPreviewPayload {
//     public readonly kind: CampaignKind = CampaignKind.AaveV3BridgeAndSupply;

//     constructor(
//         public readonly brand: AaveV3Protocol,
//         public readonly market: AaveV3Market,
//         public readonly collateral: AaveV3Collateral,
//         public readonly boostingFactor: number,
//         ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
//     ) {
//         super(...baseArgs);
//     }
// }

export class EmptyTargetCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.EmptyTarget;
    constructor(
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
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
        : T extends DistributablesType.Points
          ? CampaignPreviewPointDistributables
          : never;
}

export interface CampaignPayloadErrors {
    pool?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    rewards?: boolean;
    weighting?: boolean;
    kpiSpecification?: boolean;
    priceRangeSpecification?: boolean;
    boostingFactor?: boolean;
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

export class Campaign extends SdkCampaign {
    constructor(
        campaign: SdkCampaign,
        public readonly name: string,
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

    getTargetUsdTvl(): number | undefined {
        switch (this.target.type) {
            case TargetType.AmmPoolLiquidity:
                return this.target.pool.usdTvl;
            case TargetType.LiquityV2Debt:
                return this.target.collateral.usdMintedDebt;
            case TargetType.LiquityV2StabilityPool:
                return this.target.collateral.usdStabilityPoolDebt;
            case TargetType.AaveV3Borrow:
                return this.target.collateral.usdDebt;
            case TargetType.AaveV3NetSupply:
            case TargetType.AaveV3Supply:
                return this.target.collateral.usdSupply;
            default:
                return undefined;
        }
    }

    getTargetLiquidity(): bigint | undefined {
        switch (this.target.type) {
            case TargetType.AmmPoolLiquidity:
                return this.target.pool.liquidity;
            case TargetType.LiquityV2Debt:
                return this.target.collateral.liquidity;
            case TargetType.LiquityV2StabilityPool:
                return this.target.collateral.liquidity;
            case TargetType.AaveV3Borrow:
                return this.target.collateral.debt;
            case TargetType.AaveV3NetSupply:
            case TargetType.AaveV3Supply:
                return this.target.collateral.supply;
            default:
                return undefined;
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
            : T extends TargetType.AaveV3Borrow
              ? AaveV3BorrowTarget
              : T extends TargetType.AaveV3Supply
                ? AaveV3SupplyTarget
                : T extends TargetType.AaveV3NetSupply
                  ? AaveV3NetSupplyTarget
                  : T extends TargetType.AaveV3BridgeAndSupply
                    ? AaveV3BridgeAndSupplyTarget
                    : T extends TargetType.Empty
                      ? EmptyTarget
                      : never;
}

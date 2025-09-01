import type { Address, Hex } from "viem";
import type {
    AmmPool,
    Brand,
    ChainType,
    Erc20Token,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "./commons";
import type { SupportedAaveV3, SupportedLiquityV2 } from "src/commons";
import type { LiquityV2Collateral } from "./liquity-v2";
import type { AaveV3Collateral } from "./aave-v3";

export enum TargetType {
    Empty = "empty",
    AmmPoolLiquidity = "amm-pool-liquidity",
    LiquityV2Debt = "liquity-v2-debt",
    LiquityV2StabilityPool = "liquity-v2-stability-pool",
    AaveV3Borrow = "aave-v3-borrow",
    AaveV3Supply = "aave-v3-supply",
    AaveV3NetSupply = "aave-v3-net-supply",
}

export type LiquityV2TargetType =
    | TargetType.LiquityV2Debt
    | TargetType.LiquityV2StabilityPool;

export type AaveV3TargetType =
    | TargetType.AaveV3Borrow
    | TargetType.AaveV3Supply
    | TargetType.AaveV3NetSupply;

export interface BaseTarget {
    chainType: ChainType;
    chainId: number;
}

export interface EmptyTarget extends BaseTarget {
    type: TargetType.Empty;
}

export interface AmmPoolLiquidityTarget extends BaseTarget {
    type: TargetType.AmmPoolLiquidity;
    pool: AmmPool;
}

export interface LiquityV2Target<T> extends BaseTarget {
    type: T;
    brand: Brand<SupportedLiquityV2>;
    collateral: LiquityV2Collateral;
}

export interface AaveV3Target<T> extends BaseTarget {
    type: T;
    brand: Brand<SupportedAaveV3>;
    market: string;
    collateral: AaveV3Collateral;
}

export interface LiquityV2CollateralWithStabilityPoolDeposit
    extends Erc20Token {
    usdDeposit: number;
}

export type LiquityV2DebtTarget = LiquityV2Target<TargetType.LiquityV2Debt>;
export type LiquityV2StabilityPoolTarget =
    LiquityV2Target<TargetType.LiquityV2StabilityPool>;

export type AaveV3BorrowTarget = AaveV3Target<TargetType.AaveV3Borrow>;
export type AaveV3SupplyTarget = AaveV3Target<TargetType.AaveV3Supply>;
export type AaveV3NetSupplyTarget = AaveV3Target<TargetType.AaveV3NetSupply>;

export type CampaignTarget =
    | EmptyTarget
    | AmmPoolLiquidityTarget
    | LiquityV2DebtTarget
    | LiquityV2StabilityPoolTarget
    | AaveV3BorrowTarget
    | AaveV3SupplyTarget
    | AaveV3NetSupplyTarget;

export interface TokenDistributable {
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
    remaining: UsdPricedOnChainAmount;
}

export enum DistributablesType {
    Tokens = "tokens",
    Points = "points",
}

export interface TokenDistributables {
    type: DistributablesType.Tokens;
    list: TokenDistributable[];
    amountUsdValue: number;
    remainingUsdValue: number;
}

export interface PointDistributables {
    type: DistributablesType.Points;
    amount: OnChainAmount;
}

export enum KpiMetric {
    RangePoolTvl = "range-pool-tvl",
}

export interface RangePoolTvlKpiGoal {
    metric: KpiMetric.RangePoolTvl;
    lowerUsdTarget: number;
    upperUsdTarget: number;
}

export interface KpiSpecification {
    measurement?: number;
    minimumPayoutPercentage?: number;
    goal: RangePoolTvlKpiGoal;
}

export interface PriceRangeSpecification {
    from: number;
    to: number;
}

export interface Weighting {
    token0: number;
    token1: number;
    liquidity: number;
}

export interface Specification {
    whitelist?: Address[];
    blacklist?: Address[];
    kpi?: KpiSpecification;
    priceRange?: PriceRangeSpecification;
    weighting?: Weighting;
}

export enum RestrictionType {
    Blacklist = "blacklist",
    Whitelist = "whitelist",
}

export interface Restrictions {
    type: RestrictionType;
    list: Address[];
}

export enum Status {
    Live = "live",
    Upcoming = "upcoming",
    Ended = "ended",
}

export class Campaign {
    public readonly status;

    constructor(
        public readonly chainId: number,
        public readonly chainType: ChainType,
        public readonly id: Hex,
        public readonly from: number,
        public readonly to: number,
        public readonly createdAt: number,
        public readonly target: CampaignTarget,
        public readonly distributables:
            | TokenDistributables
            | PointDistributables,
        public readonly snapshottedAt?: number,
        public readonly specification?: Specification,
        public readonly apr?: number,
        public readonly restrictions?: Restrictions,
    ) {
        const now = Number(Math.floor(Date.now() / 1000));
        this.status =
            now < this.from
                ? Status.Upcoming
                : now > this.to
                  ? Status.Ended
                  : Status.Live;
    }

    isDistributing<T extends DistributablesType>(
        type: T,
    ): this is DistributablesCampaign<T> {
        return this.distributables.type === type;
    }

    isTargeting<T extends TargetType>(type: T): this is TargetedCampaign<T> {
        return this.target.type === type;
    }
}

export interface DistributablesCampaign<T extends DistributablesType>
    extends Campaign {
    distributables: T extends DistributablesType.Tokens
        ? TokenDistributables
        : T extends DistributablesType.Points
          ? PointDistributables
          : never;
}

export interface TargetedCampaign<T extends TargetType> extends Campaign {
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
                  : T extends TargetType.Empty
                    ? EmptyTarget
                    : never;
}

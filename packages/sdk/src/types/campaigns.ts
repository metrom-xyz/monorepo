import type { Address, Hex } from "viem";
import type {
    AmmPool,
    Brand,
    Erc20Token,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedErc20TokenAmount,
    UsdPricedOnChainAmount,
} from "./commons";
import type { SupportedLiquityV2 } from "src/commons";

export enum TargetType {
    AmmPoolLiquidity = "amm-pool-liquidity",
    LiquityV2Debt = "liquity-v2-debt",
    LiquityV2Collateral = "liquity-v2-collateral",
    LiquityV2StabilityPool = "liquity-v2-stability-pool",
}

export type LiquityV2TargetType =
    | TargetType.LiquityV2Debt
    | TargetType.LiquityV2Collateral
    | TargetType.LiquityV2StabilityPool;

export interface AmmPoolLiquidityTarget {
    type: TargetType.AmmPoolLiquidity;
    chainId: number;
    pool: AmmPool;
}

export interface LiquityV2CollateralWithDebt extends Erc20Token {
    usdDebt: number;
}

export interface LiquityV2DebtTarget {
    type: TargetType.LiquityV2Debt;
    chainId: number;
    brand: Brand<SupportedLiquityV2>;
    debts: LiquityV2CollateralWithDebt[];
    totalUsdDebt: number;
}

export interface LiquityV2CollateralTarget {
    type: TargetType.LiquityV2Collateral;
    chainId: number;
    brand: Brand<SupportedLiquityV2>;
    collaterals: UsdPricedErc20TokenAmount[];
}

export type CampaignTarget =
    | AmmPoolLiquidityTarget
    | LiquityV2DebtTarget
    | LiquityV2CollateralTarget;

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

export interface Specification {
    whitelist?: Address[];
    blacklist?: Address[];
    kpi?: KpiSpecification;
    priceRange?: PriceRangeSpecification;
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
          : T extends TargetType.LiquityV2Collateral
            ? LiquityV2CollateralTarget
            : never;
}

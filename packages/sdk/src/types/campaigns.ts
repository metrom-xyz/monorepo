import type { Address, Hex } from "viem";
import type {
    AmmPool,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "./commons";

export enum TargetType {
    AmmPoolLiquidity = "amm-pool-liquidity",
    LiquityV2Debt = "liquity-v2-debt",
}

export interface AmmPoolLiquidityTarget {
    type: TargetType.AmmPoolLiquidity;
    chainId: number;
    pool: AmmPool;
}

export interface LiquityV2DebtBrand {
    name: string;
    usdDebt: number;
}

export interface LiquityV2DebtTarget {
    type: TargetType.LiquityV2Debt;
    chainId: number;
    liquityV2Brand: LiquityV2DebtBrand;
}

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

export interface Specification {
    whitelist?: Address[];
    blacklist?: Address[];
    kpi?: KpiSpecification;
}

export enum Status {
    Live = "live",
    Upcoming = "upcoming",
    Ended = "ended",
}

export class Campaign {
    constructor(
        public readonly chainId: number,
        public readonly id: Hex,
        public readonly from: number,
        public readonly to: number,
        public readonly createdAt: number,
        public readonly target: AmmPoolLiquidityTarget | LiquityV2DebtTarget,
        public readonly distributables:
            | TokenDistributables
            | PointDistributables,
        public readonly snapshottedAt?: number,
        public readonly specification?: Specification,
        public readonly apr?: number,
    ) {}

    get status(): Status {
        const now = Number(Math.floor(Date.now() / 1000));
        if (now < this.from) return Status.Upcoming;
        if (now > this.to) return Status.Ended;
        return Status.Live;
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
          : never;
}

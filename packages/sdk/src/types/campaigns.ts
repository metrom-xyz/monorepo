import type { Address, Hex } from "viem";
import type {
    AmmPool,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "./commons";

export interface AmmPoolLiquidityTarget {
    type: "amm-pool-liquidity";
    chainId: number;
    pool: AmmPool;
}

export interface LiquityV2DebtBrand {
    name: string;
    usdDebt: number;
}

export interface LiquityV2DebtTarget {
    type: "liquity-v2-debt";
    chainId: number;
    liquityV2Brand: LiquityV2DebtBrand;
}

export interface TokenDistributable {
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
    remaining: UsdPricedOnChainAmount;
}

export interface TokenDistributables {
    type: "tokens";
    list: TokenDistributable[];
    amountUsdValue: number;
    remainingUsdValue: number;
}

export interface PointDistributables {
    type: "points";
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

export interface Campaign {
    chainId: number;
    id: Hex;
    from: number;
    to: number;
    status: Status;
    createdAt: number;
    snapshottedAt?: number;
    target: AmmPoolLiquidityTarget | LiquityV2DebtTarget;
    specification?: Specification;
    distributables: TokenDistributables | PointDistributables;
    apr?: number;
}

export interface TargetedCampaign<T extends Campaign["target"]>
    extends Campaign {
    target: T;
}

export interface TokensCampaign extends Campaign {
    distributables: TokenDistributables;
}

export interface PointsCampaign extends Campaign {
    distributables: PointDistributables;
}

export interface LiquityV2Debt {
    brand: string;
    usdDebt: number;
}

export interface CampaignsResponse {
    resolvedPricedTokens: Record<number, Record<Address, UsdPricedErc20Token>>;
    resolvedAmmPools: Record<number, Record<Address, AmmPool>>;
    resolvedLiquityV2Debts: Record<number, Record<string, LiquityV2Debt>>;
    campaigns: Campaign[];
}

export interface CampaignResponse {
    resolvedPricedTokens: Record<number, Record<Address, UsdPricedErc20Token>>;
    resolvedAmmPools: Record<number, Record<Address, AmmPool>>;
    resolvedLiquityV2Debts: Record<number, Record<string, LiquityV2Debt>>;
    campaign: Campaign;
}

import type { Address, Hex } from "viem";
import type {
    BackendResolvedAmmPoolsRegistry,
    BackendResolvedLiquityV2CollateralsRegistry,
    BackendResolvedPricedTokensRegistry,
    BackendResolvedTokensRegistry,
} from "./commons";
import type { Specification } from "src/types/campaigns";
import type { ChainType } from "src/types/commons";

export interface BackendAmmPoolLiquidityTarget {
    type: "amm-pool-liquidity";
    chainId: number;
    poolId: Hex;
}

export interface BaseBackendLiquityTarget<T> {
    type: T;
    chainId: number;
    brand: string;
    collateral: Address;
}

export type BackendLiquityV2DebtTarget =
    BaseBackendLiquityTarget<"liquity-v2-debt">;

export type BackendLiquityV2StabilityPoolTarget =
    BaseBackendLiquityTarget<"liquity-v2-stability-pool">;

export interface BackendTokenDistributable {
    token: Address;
    amount: string;
    remaining: string;
}

export interface BackendTokenDistributables {
    type: "tokens";
    list: BackendTokenDistributable[];
}

export interface BackendPointDistributables {
    type: "points";
    amount: string;
}

export enum BackendCampaignStatus {
    Active = "active",
    Upcoming = "upcoming",
    Expired = "expired",
}

export interface BackendLiquityV2Collateral {
    tvl: string;
    usdTvl: number;
    mintedDebt: number;
    stabilityPoolDebt: number;
}

export interface BackendCampaign {
    chainId: number;
    id: Hex;
    chainType: ChainType;
    from: number;
    to: number;
    createdAt: number;
    snapshottedAt?: number;
    target:
        | BackendAmmPoolLiquidityTarget
        | BackendLiquityV2DebtTarget
        | BackendLiquityV2StabilityPoolTarget;
    specification?: Specification;
    distributables: BackendTokenDistributables | BackendPointDistributables;
    apr?: number;
}

export interface BackendCampaignsResponse {
    resolvedTokens: BackendResolvedTokensRegistry;
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    resolvedAmmPools: BackendResolvedAmmPoolsRegistry;
    resolvedLiquityV2Collaterals: BackendResolvedLiquityV2CollateralsRegistry;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    resolvedTokens: BackendResolvedTokensRegistry;
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    resolvedAmmPools: BackendResolvedAmmPoolsRegistry;
    resolvedLiquityV2Collaterals: BackendResolvedLiquityV2CollateralsRegistry;
    campaign: BackendCampaign;
}

import type { Address, Hex } from "viem";
import type {
    BackendResolvedAaveV3CollateralsRegistry,
    BackendResolvedAmmPoolsRegistry,
    BackendResolvedLiquityV2CollateralsRegistry,
    BackendResolvedPricedTokensRegistry,
    BackendResolvedTokensRegistry,
} from "./commons";
import type { Specification } from "src/types/campaigns";
import type { ChainType } from "src/types/commons";

export interface BaseTarget {
    chainType: ChainType;
    chainId: number;
}

export interface BackendEmptyTarget extends BaseTarget {
    type: "empty";
}

export interface BackendAmmPoolLiquidityTarget extends BaseTarget {
    type: "amm-pool-liquidity";
    poolId: Hex;
}

export interface BackendJumperWhitelistedAmmPoolLiquidityTarget
    extends BaseTarget {
    type: "jumper-whitelisted-amm-pool-liquidity";
    poolId: Hex;
}

export interface BaseBackendLiquityTarget<T> extends BaseTarget {
    type: T;
    chainId: number;
    brand: string;
    collateral: Address;
}

export interface BackendAaveV3Target<T> extends BaseTarget {
    type: T;
    brand: string;
    market: string;
    collateral: string;
}

export type BackendLiquityV2DebtTarget =
    BaseBackendLiquityTarget<"liquity-v2-debt">;

export type BackendLiquityV2StabilityPoolTarget =
    BaseBackendLiquityTarget<"liquity-v2-stability-pool">;

export type BackendAaveV3BorrowTarget = BackendAaveV3Target<"aave-v3-borrow">;
export type BackendAaveV3SupplyTarget = BackendAaveV3Target<"aave-v3-supply">;
export type BackendAaveV3NetSupplyTarget =
    BackendAaveV3Target<"aave-v3-net-supply">;
export type BackendAaveV3BridgeAndSupplyTarget = BaseTarget & {
    type: "aave-v3-bridge-and-supply";
    bridgeBrand: string;
    aaveV3Brand: string;
    aaveV3Market: string;
    aaveV3Collateral: string;
    boostingFactor: string;
};

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
        | BackendEmptyTarget
        | BackendAmmPoolLiquidityTarget
        | BackendLiquityV2DebtTarget
        | BackendLiquityV2StabilityPoolTarget
        | BackendAaveV3BorrowTarget
        | BackendAaveV3SupplyTarget
        | BackendAaveV3NetSupplyTarget
        | BackendAaveV3BridgeAndSupplyTarget
        | BackendJumperWhitelistedAmmPoolLiquidityTarget;
    specification?: Specification;
    distributables: BackendTokenDistributables | BackendPointDistributables;
    apr?: number;
}

export interface BackendCampaignsResponse {
    resolvedTokens: BackendResolvedTokensRegistry;
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    resolvedAmmPools: BackendResolvedAmmPoolsRegistry;
    resolvedLiquityV2Collaterals: BackendResolvedLiquityV2CollateralsRegistry;
    resolvedAaveV3Collaterals: BackendResolvedAaveV3CollateralsRegistry;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    resolvedTokens: BackendResolvedTokensRegistry;
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    resolvedAmmPools: BackendResolvedAmmPoolsRegistry;
    resolvedLiquityV2Collaterals: BackendResolvedLiquityV2CollateralsRegistry;
    resolvedAaveV3Collaterals: BackendResolvedAaveV3CollateralsRegistry;
    campaign: BackendCampaign;
}

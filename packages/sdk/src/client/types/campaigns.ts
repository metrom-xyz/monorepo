import type { Address, Hex } from "viem";
import type {
    BackendAmmPool,
    BackendErc20Token,
    BackendUsdPricedErc20Token,
} from "./commons";
import type { Specification } from "src/types/campaigns";

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
    resolvedTokens: Record<number, Record<Address, BackendErc20Token>>;
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    resolvedAmmPools: Record<number, Record<Hex, BackendAmmPool>>;
    resolvedLiquityV2Collaterals: Record<
        number,
        Record<string, Record<Hex, BackendLiquityV2Collateral>>
    >;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    resolvedTokens: Record<number, Record<Address, BackendErc20Token>>;
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    resolvedAmmPools: Record<number, Record<Hex, BackendAmmPool>>;
    resolvedLiquityV2Collaterals: Record<
        number,
        Record<string, Record<Hex, BackendLiquityV2Collateral>>
    >;
    campaign: BackendCampaign;
}

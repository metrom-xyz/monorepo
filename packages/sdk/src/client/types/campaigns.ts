import type { Address, Hex } from "viem";
import type { BackendErc20Token } from "./commons";
import type { Specification } from "src/types/campaigns";
import type { ChainType } from "src/types/commons";
import type { BackendCampaignAmmPool } from "./pools";
import type { SupportedAaveV3, SupportedLiquityV2 } from "src/commons";

export interface BaseTarget {
    chainType: ChainType;
    chainId: number;
}

export interface BackendEmptyTarget extends BaseTarget {
    type: "empty";
}

export interface BackendAmmPoolLiquidityTarget
    extends BaseTarget,
        BackendCampaignAmmPool {
    type: "amm-pool-liquidity";
}

export interface BackendJumperWhitelistedAmmPoolLiquidityTarget
    extends BaseTarget,
        BackendCampaignAmmPool {
    type: "jumper-whitelisted-amm-pool-liquidity";
}

export interface BaseBackendLiquityTarget<T> extends BaseTarget {
    type: T;
    chainId: number;
    brand: SupportedLiquityV2;
    collateral: BackendErc20Token;
}

export interface BackendGmxV1Target extends BaseTarget {
    type: "gmx-v1-liquidity";
    brand: string;
}

export interface BackendAaveV3Target<T> extends BaseTarget {
    type: T;
    brand: SupportedAaveV3;
    market: string;
    collateral: BackendErc20Token;
}

export interface BackendHoldFungibleAssetTarget extends BaseTarget {
    type: "hold-fungible-asset";
    asset: BackendErc20Token;
    stakingAssets: BackendErc20Token[];
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
    aaveV3Collateral: BackendErc20Token;
    boostingFactor: string;
};

export interface BackendTokenDistributable {
    token: Address;
    amount: string;
    remaining: string;
}

export interface BackendReward extends BackendErc20Token {
    amount: string;
    remaining: string;
    usdPrice: number;
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

export interface BackendBaseCampaign {
    chainId: number;
    id: Hex;
    chainType: ChainType;
    from: number;
    to: number;
    createdAt: number;
    snapshottedAt?: number;
    type: "rewards" | "points";
    target:
        | BackendEmptyTarget
        | BackendAmmPoolLiquidityTarget
        | BackendLiquityV2DebtTarget
        | BackendLiquityV2StabilityPoolTarget
        | BackendGmxV1Target
        | BackendAaveV3BorrowTarget
        | BackendAaveV3SupplyTarget
        | BackendAaveV3NetSupplyTarget
        | BackendHoldFungibleAssetTarget
        | BackendAaveV3BridgeAndSupplyTarget
        | BackendJumperWhitelistedAmmPoolLiquidityTarget;
    specification?: Specification;
    usdTvl?: number;
    apr?: number;
}

export interface BackendPointsCampaign extends BackendBaseCampaign {
    type: "points";
    points: string;
}

export interface BackendRewardsCampaign extends BackendBaseCampaign {
    type: "rewards";
    rewards: BackendReward[];
}

export type BackendCampaign = BackendPointsCampaign | BackendRewardsCampaign;

export interface BackendCampaignsResponse {
    totalItems: number;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    campaign: BackendCampaign;
}

import type { Address, Hex } from "viem";
import type { BackendErc20Token } from "./commons";
import type { Specification } from "src/types/campaigns";
import type { ChainType, Erc20Token } from "src/types/commons";
import type { BackendCampaignAmmPool } from "./pools";
import type {
    SupportedAaveV3,
    SupportedGmxV1,
    SupportedLiquityV2,
    SupportedPointsBooster,
} from "src/commons";

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
    brand: SupportedGmxV1;
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
export interface BackendAaveV3NetSupplyTarget
    extends BackendAaveV3Target<"aave-v3-net-supply"> {
    blacklistedCrossBorrowCollaterals: Erc20Token[];
}
export type BackendAaveV3BridgeAndSupplyTarget = BaseTarget & {
    type: "aave-v3-bridge-and-supply";
    bridgeBrand: string;
    aaveV3Brand: string;
    aaveV3Market: string;
    aaveV3Collateral: BackendErc20Token;
    boostingFactor: string;
};

export type BackendTurtleClubCampaignTarget = BaseTarget & {
    type: "turtle-club";
    campaignId: string;
    id: string;
    name: string;
    description: string;
    campaignIconUrl: string;
    vaultIconUrl: string;
};

export interface BackendTokenDistributable {
    token: Address;
    amount: string;
    remaining: string;
}

export interface BackendFixedPoints {
    dailyPer1k?: number;
    amount: string;
}

export interface BackendPointsBoosting {
    type: SupportedPointsBooster;
    endpoint: string;
    multiplier: number;
}

export interface BackendDynamicPoints {
    dailyPer1k?: number;
    distributionIntervalSeconds?: number;
    boosting?: BackendPointsBoosting;
}

export interface BackendAsset extends BackendErc20Token {
    amount: string;
    remaining: string;
    usdPrice: number;
}

export interface BackendRewards {
    dailyUsd: number;
    assets: BackendAsset[];
}

export enum BackendCampaignStatus {
    Active = "active",
    Upcoming = "upcoming",
    Expired = "expired",
}

export enum BackendCampaignType {
    Rewards = "rewards",
    Points = "points",
}

export enum BackendCampaignOrderBy {
    Apr = "apr",
    UsdTvl = "usdTvl",
    From = "from",
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
    from: string;
    to: string;
    createdAt: string;
    snapshottedAt?: string;
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
        | BackendJumperWhitelistedAmmPoolLiquidityTarget
        | BackendTurtleClubCampaignTarget;
    specification?: Specification;
    usdTvl?: number;
    apr?: number;
}

export interface BackendFixedPointsCampaign {
    fixedPoints: BackendFixedPoints;
}

export interface BackendDynamicPointsCampaign {
    dynamicPoints: BackendDynamicPoints;
}

export interface BackendRewardsCampaign {
    rewards: BackendRewards;
}

export type BackendCampaign = BackendBaseCampaign &
    (
        | BackendFixedPointsCampaign
        | BackendDynamicPointsCampaign
        | BackendRewardsCampaign
    );

export interface BackendCampaignsResponse {
    totalItems: number;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    campaign: BackendCampaign;
}

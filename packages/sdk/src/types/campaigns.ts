import type { Address, Hex } from "viem";
import type {
    Brand,
    ChainType,
    Erc20Token,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "./commons";
import type {
    SupportedAaveV3,
    SupportedBridge,
    SupportedGmxV1,
    SupportedLiquityV2,
} from "src/commons";
import type { CampaignAmmPool } from "./pools";

export enum CampaignKind {
    AmmPoolLiquidity = 1,
    LiquityV2Debt = 2,
    LiquityV2StabilityPool = 3,
    GmxV1Liquidity = 4,
    EmptyTarget = 5,
    AaveV3Supply = 6,
    AaveV3Borrow = 7,
    AaveV3NetSupply = 8,
    AaveV3BridgeAndSupply = 9,
    JumperWhitelistedAmmPoolLiquidity = 10,
    HoldFungibleAsset = 11,
}

export enum BaseCampaignType {
    LiquityV2 = "liquity-v2",
    AmmPoolLiquidity = "amm-pool-liquidity",
    AaveV3 = "aave-v3",
    HoldFungibleAsset = "hold-fungible-asset",
}

export enum PartnerCampaignType {
    AaveV3BridgeAndSupply = "aave-v3-bridge-and-supply",
    JumperWhitelistedAmmPoolLiquidity = "jumper-whitelisted-amm-pool-liquidity",
}

export type CampaignType = BaseCampaignType | PartnerCampaignType;

export enum TargetType {
    Empty = "empty",
    AmmPoolLiquidity = "amm-pool-liquidity",
    GmxV1Liquidity = "gmx-v1-liquidity",
    LiquityV2Debt = "liquity-v2-debt",
    LiquityV2StabilityPool = "liquity-v2-stability-pool",
    AaveV3Borrow = "aave-v3-borrow",
    AaveV3Supply = "aave-v3-supply",
    AaveV3NetSupply = "aave-v3-net-supply",
    AaveV3BridgeAndSupply = "aave-v3-bridge-and-supply",
    JumperWhitelistedAmmPoolLiquidity = "jumper-whitelisted-amm-pool-liquidity",
    HoldFungibleAsset = "hold-fungible-asset",
    TurtleClubVault = "turtle-club-vault",
}

export type AmmPoolLiquidityTargetType =
    | TargetType.AmmPoolLiquidity
    | TargetType.JumperWhitelistedAmmPoolLiquidity;

export type LiquityV2TargetType =
    | TargetType.LiquityV2Debt
    | TargetType.LiquityV2StabilityPool;

export type AaveV3TargetType =
    | TargetType.AaveV3Borrow
    | TargetType.AaveV3Supply
    | TargetType.AaveV3NetSupply
    | TargetType.AaveV3BridgeAndSupply;

export interface BaseTarget {
    chainType: ChainType;
    chainId: number;
}

export interface EmptyTarget extends BaseTarget {
    type: TargetType.Empty;
}

export interface AmmPoolLiquidityTarget extends BaseTarget {
    type: TargetType.AmmPoolLiquidity;
    pool: CampaignAmmPool;
}

export interface GmxV1LiquidityTarget extends BaseTarget {
    type: TargetType.GmxV1Liquidity;
    brand: Brand<SupportedGmxV1>;
}

export interface JumperWhitelistedAmmPoolLiquidityTarget extends BaseTarget {
    type: TargetType.JumperWhitelistedAmmPoolLiquidity;
    pool: CampaignAmmPool;
}

export interface LiquityV2Target<T> extends BaseTarget {
    type: T;
    brand: Brand<SupportedLiquityV2>;
    collateral: Erc20Token;
}

export interface AaveV3Target<T> extends BaseTarget {
    type: T;
    brand: Brand<SupportedAaveV3>;
    market: string;
    collateral: Erc20Token;
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
export interface AaveV3NetSupplyTarget
    extends AaveV3Target<TargetType.AaveV3NetSupply> {
    blacklistedCrossBorrowCollaterals: Erc20Token[];
}
export type AaveV3BridgeAndSupplyTarget = BaseTarget & {
    type: TargetType.AaveV3BridgeAndSupply;
    bridge: Brand<SupportedBridge>;
    brand: Brand<SupportedAaveV3>;
    market: string;
    collateral: Erc20Token;
    boostingFactor: number;
};

export interface HoldFungibleAssetTarget extends BaseTarget {
    type: TargetType.HoldFungibleAsset;
    asset: Erc20Token;
    stakingAssets: Erc20Token[];
}

export interface TurtleClubVaultTarget extends BaseTarget {
    type: TargetType.TurtleClubVault;
    id: string;
    name: string;
    description: string;
    campaignIconUrl: string;
    vaultIconUrl: string;
}

export type CampaignTarget =
    | EmptyTarget
    | AmmPoolLiquidityTarget
    | GmxV1LiquidityTarget
    | LiquityV2DebtTarget
    | LiquityV2StabilityPoolTarget
    | AaveV3BorrowTarget
    | AaveV3SupplyTarget
    | AaveV3NetSupplyTarget
    | AaveV3BridgeAndSupplyTarget
    | JumperWhitelistedAmmPoolLiquidityTarget
    | HoldFungibleAssetTarget
    | TurtleClubVaultTarget;

export interface TokenDistributable {
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
    remaining: UsdPricedOnChainAmount;
}

export enum DistributablesType {
    Tokens = "tokens",
    FixedPoints = "fixed-points",
    DynamicPoints = "dynamic-points",
}

export interface TokenDistributables {
    type: DistributablesType.Tokens;
    dailyUsd: number;
    list: TokenDistributable[];
    amountUsdValue: number;
    remainingUsdValue: number;
}

export interface FixedPointDistributables {
    type: DistributablesType.FixedPoints;
    amount: OnChainAmount;
    dailyPer1k?: number;
}

export interface DynamicPointDistributables {
    type: DistributablesType.DynamicPoints;
    dailyPer1k?: number;
    distributionIntervalSeconds?: number;
}

export type CampaignDistributables =
    | TokenDistributables
    | FixedPointDistributables
    | DynamicPointDistributables;

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
    Active = "active",
    Upcoming = "upcoming",
    Expired = "expired",
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
        public readonly distributables: CampaignDistributables,
        public readonly snapshottedAt?: number,
        public readonly specification?: Specification,
        public readonly usdTvl?: number,
        public readonly apr?: number,
        public readonly restrictions?: Restrictions,
    ) {
        const now = Number(Math.floor(Date.now() / 1000));
        this.status =
            now < this.from
                ? Status.Upcoming
                : now > this.to
                  ? Status.Expired
                  : Status.Active;
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
        : T extends DistributablesType.FixedPoints
          ? FixedPointDistributables
          : T extends DistributablesType.DynamicPoints
            ? DynamicPointDistributables
            : never;
}

export interface BaseTargetedCampaign<T extends TargetType> {
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
                    : T extends TargetType.JumperWhitelistedAmmPoolLiquidity
                      ? JumperWhitelistedAmmPoolLiquidityTarget
                      : T extends TargetType.HoldFungibleAsset
                        ? HoldFungibleAssetTarget
                        : T extends TargetType.TurtleClubVault
                          ? TurtleClubVaultTarget
                          : T extends TargetType.Empty
                            ? EmptyTarget
                            : never;
}

export type TargetedCampaign<T extends TargetType> = BaseTargetedCampaign<T> &
    Campaign;

import { TargetType, CampaignKind } from "./types/campaigns";

export enum Environment {
    Development = "development",
    Production = "production",
}

export enum SupportedDex {
    UniswapV3 = "uniswap-v3",
    TestIntegral = "test-integral",
    Swapsicle = "swapsicle",
    Panko = "panko",
    Fibonacci = "fibonacci",
    ThirdTrade = "third-trade",
    Unagi = "unagi",
    Carbon = "carbon",
    Velodrome = "velodrome",
    Morphex = "morphex",
    Izumi = "izumi",
    Hydrex = "hydrex",
    BalancerV3 = "balancer-v3",
    Curve = "curve",
    Ambient = "ambient",
    Honeypop = "honeypop",
    Lithos = "lithos",
    Quickswap = "quickswap",
    Hyperion = "hyperion",
    Thala = "thala",
}

export enum SupportedLiquityV2 {
    Ebisu = "ebisu",
    Liquity = "liquity",
    Quill = "quill",
    Orki = "orki",
}

export enum SupportedAaveV3 {
    Aave = "aave",
}

export enum SupportedBridge {
    LayerZero = "layer-zero",
}

export enum SupportedGmxV1 {
    Amped = "amped",
}

export enum SupportedLiquidityProviderDeal {
    Turtle = "turtle",
}

export enum SupportedTurtleDeal {
    TurtleKatana = "turtle-katana",
    TurtleLinea = "turtle-linea",
}

export enum SupportedYieldSeeker {
    YieldSeeker = "yield-seeker",
}

export type SupportedProtocol =
    | SupportedDex
    | SupportedLiquityV2
    | SupportedAaveV3
    | SupportedBridge
    | SupportedGmxV1
    | SupportedLiquidityProviderDeal
    | SupportedYieldSeeker;

export enum SupportedAmm {
    AlgebraIntegral = "algebra-integral",
    Velodrome = "velodrome",
    UniswapV3 = "uniswap-v3",
    Carbon = "carbon",
    PancakeV3 = "pancake-v3",
    Izumi = "izumi",
    BalancerV3 = "balancer-v3",
    Croc = "croc",
    Curve = "curve",
    Lithos = "lithos",
    Hyperion = "hyperion",
    Thala = "thala",
}

export enum SupportedPointsBooster {
    LiquidityLand = "liquidity-land",
}

export interface ServiceUrls {
    dataManager: string;
    metrom: string;
}

export const CAMPAIGN_TARGET_TO_KIND: Record<TargetType, CampaignKind> = {
    // These campaigns are not metrom native, so there's not campaign kind; we use the empty kind to avoid type issues.
    [TargetType.Turtle]: CampaignKind.EmptyTarget,
    [TargetType.YieldSeeker]: CampaignKind.EmptyTarget,
    // Amm pool net swap volume is not currently supported, so it doesn't have a campaign kind;
    // we use the empty kind to avoid type issues.
    [TargetType.AmmPoolNetSwapVolume]: CampaignKind.EmptyTarget,
    [TargetType.AmmPoolLiquidity]: CampaignKind.AmmPoolLiquidity,
    [TargetType.LiquityV2Debt]: CampaignKind.LiquityV2Debt,
    [TargetType.LiquityV2StabilityPool]: CampaignKind.LiquityV2StabilityPool,
    [TargetType.GmxV1Liquidity]: CampaignKind.GmxV1Liquidity,
    [TargetType.Empty]: CampaignKind.EmptyTarget,
    [TargetType.AaveV3Supply]: CampaignKind.AaveV3Supply,
    [TargetType.AaveV3Borrow]: CampaignKind.AaveV3Borrow,
    [TargetType.AaveV3NetSupply]: CampaignKind.AaveV3NetSupply,
    [TargetType.AaveV3BridgeAndSupply]: CampaignKind.AaveV3BridgeAndSupply,
    [TargetType.JumperWhitelistedAmmPoolLiquidity]:
        CampaignKind.JumperWhitelistedAmmPoolLiquidity,
    [TargetType.HoldFungibleAsset]: CampaignKind.HoldFungibleAsset,
};

export const SERVICE_URLS: Record<Environment, ServiceUrls> = {
    [Environment.Development]: {
        dataManager: "https://data-manager.dev.metrom.xyz",
        metrom: "https://api.dev.metrom.xyz",
    },
    [Environment.Production]: {
        dataManager: "https://data-manager.metrom.xyz",
        metrom: "https://api.metrom.xyz",
    },
};

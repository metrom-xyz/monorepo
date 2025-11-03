import { TargetType, CampaignKind } from "./types/campaigns";

export enum Environment {
    Development = "development",
    Production = "production",
}

export enum SupportedDex {
    UniswapV3 = "uniswap-v3",
    TestIntegral = "test-integral",
    Swapsicle = "swapsicle",
    Kim = "kim",
    Panko = "panko",
    Scribe = "scribe",
    BaseSwap = "baseswap",
    Fibonacci = "fibonacci",
    ThirdTrade = "third-trade",
    SilverSwap = "silverswap",
    Swapr = "swapr",
    Unagi = "unagi",
    Carbon = "carbon",
    Velodrome = "velodrome",
    Morphex = "morphex",
    Izumi = "izumi",
    Hydrex = "hydrex",
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

export type SupportedProtocol =
    | SupportedDex
    | SupportedLiquityV2
    | SupportedAaveV3
    | SupportedBridge
    | SupportedGmxV1;

export enum SupportedAmm {
    AlgebraIntegral = "algebra-integral",
    Velodrome = "velodrome",
    UniswapV3 = "uniswap-v3",
    Carbon = "carbon",
    PancakeV3 = "pancake-v3",
    Izumi = "izumi",
}

export interface ServiceUrls {
    dataManager: string;
    metrom: string;
}

export const CAMPAIGN_TARGET_TO_KIND: Record<TargetType, CampaignKind> = {
    [TargetType.AmmPoolLiquidity]: CampaignKind.AmmPoolLiquidity,
    [TargetType.LiquityV2Debt]: CampaignKind.LiquityV2Debt,
    [TargetType.LiquityV2StabilityPool]: CampaignKind.LiquityV2StabilityPool,
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

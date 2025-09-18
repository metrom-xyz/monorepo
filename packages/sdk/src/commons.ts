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

export enum SupportedGmxV1 {
    Amped = "amped",
}

export enum SupportedAmm {
    AlgebraIntegral = "algebra-integral",
    Velodrome = "velodrome",
    UniswapV3 = "uniswap-v3",
    Carbon = "carbon",
    PancakeV3 = "pancake-v3",
}

export interface ServiceUrls {
    dataManager: string;
    metrom: string;
}

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

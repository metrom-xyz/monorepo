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
}

export enum SupportedLiquityV2 {
    Ebisu = "ebisu",
    Liquity = "liquity",
    Quill = "quill",
    Orki = "orki",
}

export enum SupportedAmm {
    AlgebraIntegral = "algebra-integral",
    UniswapV3 = "uniswap-v3",
    Carbon = "carbon",
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

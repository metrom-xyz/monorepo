import { SupportedChain, Environment } from "@metrom-xyz/contracts";

export const SUPPORTED_CHAIN_NAMES: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
    [SupportedChain.CeloAlfajores]: "celo-alfajores",
    [SupportedChain.MantleSepolia]: "mantle-sepolia",
};

export enum SupportedAmm {
    Univ3 = "uni-v3",
    TestIntegral = "test-integral",
    Swapsicle = "swapsicle",
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
    [Environment.Staging]: {
        dataManager: "https://data-manager.staging.metrom.xyz",
        metrom: "https://api.staging.metrom.xyz",
    },
};

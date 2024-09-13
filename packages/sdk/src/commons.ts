import { SupportedChain, Environment } from "@metrom-xyz/contracts";

export const SUPPORTED_CHAIN_NAMES: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
    [SupportedChain.CeloAlfajores]: "celo-alfajores",
    [SupportedChain.MantleSepolia]: "mantle-sepolia",
    [SupportedChain.Mode]: "mode",
    [SupportedChain.Mantle]: "mantle",
};

export enum SupportedAmm {
    Univ3 = "uniswap-v3",
    TestIntegral = "test-integral",
    Swapsicle = "swapsicle",
    Kim = "kim",
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

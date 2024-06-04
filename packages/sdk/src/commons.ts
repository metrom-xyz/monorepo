import { SupportedChain } from "@metrom-xyz/contracts";
import { Cacher } from "./cacher";

export const SUPPORTED_CHAIN_NAMES: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
    [SupportedChain.CeloAlfajores]: "celo-alfajores",
};

export const CACHER = new Cacher("metrom-sdk");

export enum SupportedAmm {
    Univ3 = "uni-v3",
    TestIntegral = "test-integral",
}

export enum Environment {
    Development = "development",
    Staging = "staging",
    Production = "production",
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
    [Environment.Production]: {
        dataManager: "https://data-manager.metrom.xyz",
        metrom: "https://api.metrom.xyz",
    },
};

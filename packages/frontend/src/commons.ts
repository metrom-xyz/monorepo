import { defineChain, type ChainFormatters } from "viem";
import {
    Environment,
    type ServiceUrls,
    type SupportedChain,
} from "@carrot-kpi/sdk";
import { celo, gnosis } from "viem/chains";
import GnosisLogo from "./icons/GnosisLogoIcon.vue";
import { ChainId, type MetromChain } from "./types";

export const SERVICE_URLS: Record<Environment, ServiceUrls> = {
    [Environment.Development]: {
        staticCdn: "https://static.dev.carrot.community",
        dataCdn: "https://data.dev.carrot.community",
        dataManager: "https://data-manager.api.dev.carrot.community",
    },
    [Environment.Staging]: {
        staticCdn: "https://static.staging.carrot.community",
        dataCdn: "https://data.staging.carrot.community",
        dataManager: "https://data-manager.api.staging.carrot.community",
    },
};

// FIXME: move this configuration to the sdk
export const SUPPORTED_CHAIN: Record<ChainId, SupportedChain> = {
    [ChainId.Gnosis]: defineChain<ChainFormatters, SupportedChain>({
        ...gnosis,
        // FIXME: add contract addresses once deployed
        contracts: {
            ...gnosis.contracts,
            factory: { address: "0x" },
            kpiTokensManager: { address: "0x" },
            oraclesManager: { address: "0x" },
        },
        environment: Environment.Development,
        serviceUrls: {
            ...SERVICE_URLS[Environment.Staging],
            // FIXME: use proper subgraph url
            subgraph:
                "https://api.thegraph.com/subgraphs/name/carrot-kpi/carrot-gnosis",
        },
    }),
    [ChainId.Celo]: defineChain<ChainFormatters, SupportedChain>({
        ...celo,
        // FIXME: add contract addresses once deployed
        contracts: {
            ...celo.contracts,
            factory: { address: "0x" },
            kpiTokensManager: { address: "0x" },
            oraclesManager: { address: "0x" },
        },
        environment: Environment.Development,
        serviceUrls: {
            ...SERVICE_URLS[Environment.Development],
            // FIXME: use proper subgraph url
            subgraph:
                "https://api.thegraph.com/subgraphs/name/carrot-kpi/carrot-celo",
        },
    }),
};

export const METROM_CHAIN: Record<ChainId, MetromChain> = {
    [ChainId.Gnosis]: {
        ...SUPPORTED_CHAIN[ChainId.Gnosis],
        icon: {
            logo: GnosisLogo,
            backgroundColor: "#213147",
        },
    },
    [ChainId.Celo]: {
        ...SUPPORTED_CHAIN[ChainId.Celo],
        icon: {
            logo: GnosisLogo,
            backgroundColor: "#213147",
        },
    },
};

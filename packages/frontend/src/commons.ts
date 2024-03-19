import { defineChain, type ChainFormatters } from "viem";
import { celo, gnosis } from "viem/chains";
import GnosisLogo from "./icons/GnosisLogoIcon.vue";
import { ChainId, type MetromChain, type SupportedChain } from "./types";

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
        // FIXME: use proper subgraph url
        subgraphUrl:
            "https://api.thegraph.com/subgraphs/name/carrot-kpi/carrot-gnosis",
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
        // FIXME: use proper subgraph url
        subgraphUrl:
            "https://api.thegraph.com/subgraphs/name/carrot-kpi/carrot-celo",
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

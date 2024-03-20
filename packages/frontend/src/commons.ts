import { defineChain, type ChainFormatters, type Transport, http } from "viem";
import { celoAlfajores } from "viem/chains";
import GnosisLogo from "./icons/GnosisLogoIcon.vue";
import { type MetromChain, type SupportedChain } from "./types";
import {
    ADDRESS,
    SupportedChain as MetromChainId,
} from "@metrom-xyz/contracts";

// FIXME: move this configuration to the sdk
export const SUPPORTED_CHAIN: Record<MetromChainId, SupportedChain> = {
    [MetromChainId.CeloAlfajores]: defineChain<ChainFormatters, SupportedChain>(
        {
            ...celoAlfajores,
            contracts: {
                ...celoAlfajores.contracts,
                factory: ADDRESS[MetromChainId.CeloAlfajores],
            },
            subgraphUrl:
                "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
        },
    ),
};

export const SUPPORTED_CHAINS: [MetromChain, ...MetromChain[]] = [
    {
        ...SUPPORTED_CHAIN[MetromChainId.CeloAlfajores],
        icon: {
            // FIXME: use celo logo
            logo: GnosisLogo,
            backgroundColor: "#213147",
        },
    },
];

export const SUPPORTED_CHAIN_TRANSPORT: Record<MetromChainId, Transport> = {
    [MetromChainId.CeloAlfajores]: http(),
};

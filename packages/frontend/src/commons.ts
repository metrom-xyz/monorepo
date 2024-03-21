import {
    defineChain,
    type ChainFormatters,
    type Transport,
    http,
    type Chain,
} from "viem";
import { celoAlfajores } from "viem/chains";
import { type Amm, type SupportedChain } from "./types";
import {
    ADDRESS,
    SupportedChain as MetromChainId,
} from "@metrom-xyz/contracts";
import UniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import GnosisLogoIcon from "./icons/GnosisLogoIcon.vue";

export const SUPPORTED_AMM: Record<MetromChainId, Amm> = {
    [MetromChainId.CeloAlfajores]: {
        logo: UniswapLogoIcon,
        name: "Uniswap v3",
        subgraphUrl:
            "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
    },
};

export const METROM_CHAIN: Record<MetromChainId, SupportedChain> = {
    [MetromChainId.CeloAlfajores]: defineChain<ChainFormatters, SupportedChain>(
        {
            ...celoAlfajores,
            icon: {
                // FIXME: use celo logo
                logo: GnosisLogoIcon,
                backgroundColor: "#213147",
            },
            contracts: {
                ...celoAlfajores.contracts,
                factory: ADDRESS[MetromChainId.CeloAlfajores],
            },
            subgraphUrl:
                "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
        },
    ),
};

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [celoAlfajores];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
};

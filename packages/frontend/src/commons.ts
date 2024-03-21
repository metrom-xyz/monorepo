import { type Transport, http, type Chain } from "viem";
import { celoAlfajores } from "viem/chains";
import { type Amm, type ChainData } from "./types";
import {
    ADDRESS,
    SupportedChain as MetromChainId,
} from "@metrom-xyz/contracts";
import UniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import GnosisLogoIcon from "./icons/GnosisLogoIcon.vue";

export const CHAIN_DATA: Record<MetromChainId, ChainData> = {
    [MetromChainId.CeloAlfajores]: {
        icon: {
            // FIXME: use celo logo
            logo: GnosisLogoIcon,
            backgroundColor: "#213147",
        },
        contracts: {
            factory: ADDRESS[MetromChainId.CeloAlfajores],
        },
        subgraphUrl:
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
        amms: [
            {
                logo: UniswapLogoIcon,
                name: "Uniswap v3",
                subgraphUrl:
                    "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
            },
        ],
    },
};

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [celoAlfajores];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
};

import { type Transport, http, type Chain } from "viem";
import { celoAlfajores } from "viem/chains";
import { type ChainData } from "./types";
import {
    ADDRESS,
    SupportedChain as MetromChainId,
} from "@metrom-xyz/contracts";
import UniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import CeloIcon from "./icons/CeloIcon.vue";
import { markRaw } from "vue";

export const MIN_CAMPAIGN_HOURS_DURATION = 2;

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/xdai/all.json",
    "https://tokens.coingecko.com/celo/all.json",
];

export const CHAIN_DATA: Record<MetromChainId, ChainData> = {
    [MetromChainId.CeloAlfajores]: {
        icon: {
            // FIXME: use better icon
            logo: markRaw(CeloIcon),
            backgroundColor: "#213147",
        },
        contracts: {
            factory: ADDRESS[MetromChainId.CeloAlfajores],
        },
        subgraphUrl:
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
        amms: [
            {
                slug: "univ3",
                // FIXME: use better icon
                logo: markRaw(UniswapLogoIcon),
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

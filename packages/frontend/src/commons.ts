import { SupportedChain, AmmSubgraphClient } from "sdk";
import { type Transport, http, type Chain } from "viem";
import { celoAlfajores } from "viem/chains";
import type { ChainData } from "./types";
import MuiCeloIcon from "./icons/CeloIcon.vue";
import MuiUniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import { ADDRESSES } from "@metrom-xyz/contracts";
import { markRaw } from "vue";

export const MIN_CAMPAIGN_HOURS_DURATION = 2;

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/xdai/all.json",
    "https://tokens.coingecko.com/celo/all.json",
    "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [celoAlfajores];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
};

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    [SupportedChain.CeloAlfajores]: {
        icon: {
            logo: markRaw(MuiCeloIcon),
            backgroundColor: "#000",
        },
        contracts: {
            factory: ADDRESSES[SupportedChain.CeloAlfajores].factory,
        },
        amms: [
            {
                slug: "uni-v3",
                logo: markRaw(MuiUniswapLogoIcon),
                name: "Uniswap v3",
                subgraphClient: new AmmSubgraphClient(
                    SupportedChain.CeloAlfajores,
                    "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
                ),
            },
        ],
    },
};

import { SupportedChain, AmmSubgraphClient, MetromSubgraphClient } from "sdk";
import { type Transport, http, type Chain } from "viem";
import { celoAlfajores } from "viem/chains";
import type { Amm, ChainData } from "./types";
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

const AMMS: Record<SupportedChain, Amm[]> = {
    [SupportedChain.CeloAlfajores]: [
        {
            slug: "uni-v3",
            logo: markRaw(MuiUniswapLogoIcon),
            name: "Uniswap v3",
            addLiquidityUrl: "https://app.uniswap.org/add/{target_pair}",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.CeloAlfajores,
                "uni-v3",
                "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
            ),
        },
    ],
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
        metromSubgraphClient: new MetromSubgraphClient(
            SupportedChain.CeloAlfajores,
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
            AMMS[SupportedChain.CeloAlfajores].map((amm) => amm.subgraphClient),
        ),
        amms: AMMS[SupportedChain.CeloAlfajores],
    },
};

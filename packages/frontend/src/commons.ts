import { SupportedChain, AmmSubgraphClient, MetromSubgraphClient } from "sdk";
import { type Transport, http, type Chain } from "viem";
import { celoAlfajores, holesky, sepolia } from "viem/chains";
import type { Amm, ChainData } from "./types";
import MuiCeloIcon from "./icons/CeloIcon.vue";
import MuiEthIcon from "./icons/EthIcon.vue";
import MuiUniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import MuiAlgebraIntegralIcon from "./icons/AlgebraIntegralIcon.vue";
import { ADDRESS } from "@metrom-xyz/contracts";
import { markRaw } from "vue";

export const MIN_CAMPAIGN_HOURS_DURATION = 2;

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/celo/all.json",
    "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [
    celoAlfajores,
    sepolia,
    holesky,
];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
    [sepolia.id]: http(),
    [holesky.id]: http(),
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
    [SupportedChain.Sepolia]: [
        {
            slug: "uni-v3",
            logo: markRaw(MuiUniswapLogoIcon),
            name: "Uniswap v3",
            addLiquidityUrl: "https://app.uniswap.org/add/{target_pair}",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.Sepolia,
                "uni-v3",
                "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-sepolia/version/latest",
            ),
        },
    ],
    [SupportedChain.Holesky]: [
        {
            slug: "algebra-integral",
            logo: markRaw(MuiAlgebraIntegralIcon),
            name: "Algebra integral",
            addLiquidityUrl:
                "https://integral.algebra.finance/pool/{target_pair}/new-position",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.Holesky,
                "algebra-integral",
                "https://api.studio.thegraph.com/query/68570/metrom-test-integral-holesky/version/latest",
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
        contract: ADDRESS[SupportedChain.CeloAlfajores],
        metromSubgraphClient: new MetromSubgraphClient(
            SupportedChain.CeloAlfajores,
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
            AMMS[SupportedChain.CeloAlfajores].map((amm) => amm.subgraphClient),
        ),
        amms: AMMS[SupportedChain.CeloAlfajores],
    },
    [SupportedChain.Sepolia]: {
        icon: {
            logo: markRaw(MuiEthIcon),
            backgroundColor: "#000",
        },
        contract: ADDRESS[SupportedChain.Sepolia],
        metromSubgraphClient: new MetromSubgraphClient(
            SupportedChain.Sepolia,
            "https://api.studio.thegraph.com/query/68570/metrom-sepolia/version/latest",
            AMMS[SupportedChain.Sepolia].map((amm) => amm.subgraphClient),
        ),
        amms: AMMS[SupportedChain.Sepolia],
    },
    [SupportedChain.Holesky]: {
        icon: {
            logo: markRaw(MuiEthIcon),
            backgroundColor: "#000",
        },
        contract: ADDRESS[SupportedChain.Holesky],
        metromSubgraphClient: new MetromSubgraphClient(
            SupportedChain.Holesky,
            "https://api.studio.thegraph.com/query/68570/metrom-holesky/version/latest",
            AMMS[SupportedChain.Holesky].map((amm) => amm.subgraphClient),
        ),
        amms: AMMS[SupportedChain.Holesky],
    },
};

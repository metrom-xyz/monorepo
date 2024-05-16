import {
    SupportedChain,
    AmmSubgraphClient,
    MetromApiClient,
    SupportedAmm,
} from "sdk";
import { type Transport, http, type Chain } from "viem";
import { holesky } from "viem/chains";
import { type Amm, type ChainData } from "./types";
import MuiEthIcon from "./icons/EthIcon.vue";
import MuiAlgebraIntegralIcon from "./icons/AlgebraIntegralIcon.vue";
import { ADDRESS } from "@metrom-xyz/contracts";
import { markRaw } from "vue";

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/celo/all.json",
    "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [
    // celoAlfajores,
    // sepolia,
    holesky,
];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    // [celoAlfajores.id]: http(),
    // [sepolia.id]: http(),
    [holesky.id]: http(),
};

const AMMS: Record<SupportedChain, Amm[]> = {
    // [SupportedChain.CeloAlfajores]: [
    //     {
    //         slug: SupportedAmm.Univ3,
    //         logo: markRaw(MuiUniswapLogoIcon),
    //         name: "Uniswap v3",
    //         addLiquidityUrl: "https://app.uniswap.org/add/{target_pair}",
    //         pairExplorerUrl:
    //             "https://app.uniswap.org/explore/pools/celo_alfajores/{target_pair}",
    //         subgraphClient: new AmmSubgraphClient(
    //             SupportedChain.CeloAlfajores,
    //             SupportedAmm.Univ3,
    //             "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
    //         ),
    //     },
    // ],
    // [SupportedChain.Sepolia]: [
    //     {
    //         slug: SupportedAmm.Univ3,
    //         logo: markRaw(MuiUniswapLogoIcon),
    //         name: "Uniswap v3",
    //         addLiquidityUrl: "https://app.uniswap.org/add/{target_pair}",
    //         pairExplorerUrl:
    //             "https://app.uniswap.org/explore/pools/sepolia/{target_pair}",
    //         subgraphClient: new AmmSubgraphClient(
    //             SupportedChain.Sepolia,
    //             SupportedAmm.Univ3,
    //             "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-sepolia/version/latest",
    //         ),
    //     },
    // ],
    [SupportedChain.Holesky]: [
        {
            slug: SupportedAmm.TestIntegral,
            logo: markRaw(MuiAlgebraIntegralIcon),
            name: "Algebra integral",
            addLiquidityUrl:
                "https://integral.algebra.finance/pool/{target_pair}/new-position",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.Holesky,
                SupportedAmm.TestIntegral,
                "https://api.studio.thegraph.com/query/68570/metrom-test-integral-holesky/version/latest",
            ),
        },
    ],
};

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    // [SupportedChain.CeloAlfajores]: {
    //     icon: {
    //         logo: markRaw(MuiCeloIcon),
    //         backgroundColor: "#000",
    //     },
    //     contract: ADDRESS[SupportedChain.CeloAlfajores],
    //     metromSubgraphClient: new MetromSubgraphClient(
    //         SupportedChain.CeloAlfajores,
    //         "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
    //         AMMS[SupportedChain.CeloAlfajores].map((amm) => amm.subgraphClient),
    //     ),
    //     amms: AMMS[SupportedChain.CeloAlfajores],
    // },
    // [SupportedChain.Sepolia]: {
    //     icon: {
    //         logo: markRaw(MuiEthIcon),
    //         backgroundColor: "#000",
    //     },
    //     contract: ADDRESS[SupportedChain.Sepolia],
    //     metromSubgraphClient: new MetromSubgraphClient(
    //         SupportedChain.Sepolia,
    //         "https://api.studio.thegraph.com/query/68570/metrom-sepolia/version/latest",
    //         AMMS[SupportedChain.Sepolia].map((amm) => amm.subgraphClient),
    //     ),
    //     amms: AMMS[SupportedChain.Sepolia],
    // },
    [SupportedChain.Holesky]: {
        icon: {
            logo: markRaw(MuiEthIcon),
            backgroundColor: "#000",
        },
        contract: ADDRESS[SupportedChain.Holesky],
        metromApiClient: new MetromApiClient(
            "https://api.dev.metrom.xyz",
            SupportedChain.Holesky,
        ),
        amms: AMMS[SupportedChain.Holesky],
    },
};

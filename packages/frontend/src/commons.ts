import { SupportedChain, AmmSubgraphClient, SupportedAmm } from "sdk";
import { type Transport, http, type Chain } from "viem";
import { celoAlfajores, holesky } from "viem/chains";
import { type Amm } from "./types";
import MuiEthIcon from "./icons/EthIcon.vue";
import MuiAlgebraIntegralIcon from "./icons/AlgebraIntegralIcon.vue";
import MuiCeloIcon from "./icons/CeloIcon.vue";
import MuiUniswapLogoIcon from "./icons/UniswapLogoIcon.vue";
import { markRaw, type Component } from "vue";
import { buildChainData } from "./utils/chain-data";

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/celo/all.json",
    "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [
    celoAlfajores,
    // sepolia,
    holesky,
];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
    // [sepolia.id]: http(),
    [holesky.id]: http(),
};

export const SUPPORTED_CHAIN_ICONS: Record<SupportedChain, Component> = {
    [SupportedChain.CeloAlfajores]: markRaw(MuiCeloIcon),
    [SupportedChain.Holesky]: markRaw(MuiEthIcon),
};

export const SUPPORTED_AMMS: Record<SupportedChain, Amm[]> = {
    [SupportedChain.CeloAlfajores]: [
        {
            slug: SupportedAmm.Univ3,
            logo: markRaw(MuiUniswapLogoIcon),
            name: "Uniswap v3",
            addLiquidityUrl: "https://app.uniswap.org/add/{target_pool}",
            poolExplorerUrl:
                "https://app.uniswap.org/explore/pools/celo_alfajores/{target_pool}",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.CeloAlfajores,
                SupportedAmm.Univ3,
                "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
            ),
        },
    ],
    [SupportedChain.Holesky]: [
        {
            slug: SupportedAmm.TestIntegral,
            logo: markRaw(MuiAlgebraIntegralIcon),
            name: "Algebra integral",
            addLiquidityUrl:
                "https://integral.algebra.finance/pool/{target_pool}/new-position",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.Holesky,
                SupportedAmm.TestIntegral,
                "https://api.studio.thegraph.com/query/68570/metrom-test-integral-holesky/version/latest",
            ),
        },
    ],
};

export const CHAIN_DATA = buildChainData();

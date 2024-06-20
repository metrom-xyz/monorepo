import {
    SupportedChain,
    AmmSubgraphClient,
    SupportedAmm,
    type Erc20Token,
} from "sdk";
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

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [celoAlfajores, holesky];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
    [holesky.id]: http(),
};

export const SUPPORTED_CHAIN_ICONS: Record<SupportedChain, Component> = {
    [SupportedChain.CeloAlfajores]: markRaw(MuiCeloIcon),
    [SupportedChain.Holesky]: markRaw(MuiEthIcon),
};

export const POPULAR_CHAIN_TOKENS: Record<SupportedChain, Erc20Token[]> = {
    [SupportedChain.CeloAlfajores]: [
        {
            address: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
            chainId: SupportedChain.CeloAlfajores,
            decimals: 18,
            name: "Celo",
            symbol: "CELO",
        },
        {
            address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
            chainId: SupportedChain.CeloAlfajores,
            decimals: 18,
            name: "Celo Dollar",
            symbol: "cUSD",
        },
        {
            address: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
            chainId: SupportedChain.CeloAlfajores,
            decimals: 18,
            name: "Celo Euro",
            symbol: "cEUR",
        },
    ],
    [SupportedChain.Holesky]: [
        {
            address: "0x94373a4919b3240d86ea41593d5eba789fef3848",
            chainId: SupportedChain.Holesky,
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x7d98346b3b000c55904918e3d9e2fc3f94683b01",
            chainId: SupportedChain.Holesky,
            decimals: 18,
            name: "USDT",
            symbol: "USDT",
        },
    ],
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

import {
    SupportedChain,
    AmmSubgraphClient,
    SupportedAmm,
    type Erc20Token,
} from "sdk";
import { type Transport, http, type Chain, type Address } from "viem";
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

export const BASE_CHAIN_TOKENS: Record<SupportedChain, Erc20Token[]> = {
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

export const REWARD_TOKEN_ICONS: Record<
    SupportedChain,
    Record<Address, string>
> = {
    [SupportedChain.Holesky]: {
        "0x94373a4919b3240d86ea41593d5eba789fef3848":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        "0x0fe5a93b63accf31679321dd0daf341c037a1187":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        "0xa5ba8636a78bbf1910430d0368c0175ef5a1845b":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    [SupportedChain.CeloAlfajores]: {
        "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9":
            "https://assets.coingecko.com/coins/images/11090/standard/InjXBNx9_400x400.jpg?1696511031",
        "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73/logo.png",
        "0x2043d9aa54e333c52db22a8afbfcbdce35958f42":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        "0x22d8655b405f6a8d6bb7c5838aaf187a32158b07":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
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

import {
    SupportedChain,
    AmmSubgraphClient,
    SupportedAmm,
    type Erc20Token,
} from "@metrom-xyz/sdk";
import { type Transport, http, type Chain, type Address } from "viem";
import { celoAlfajores, holesky, mantleSepoliaTestnet } from "viem/chains";
import { type Amm } from "./types";
import { buildChainData } from "./utils/chain-data";
import type { FunctionComponent } from "react";
import { CeloIcon } from "./components/assets/celo-icon";
import { EthIcon } from "./components/assets/eth-icon";
import { MantleIcon } from "./components/assets/mantle-icon";
import { UniswapLogo } from "./components/assets/uniswap-logo";
import { AlgebraIntegralLogo } from "./components/assets/algebra-integral-logo";
import { SwapsicleIcon } from "./components/assets/swapsicle-icon";

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [
    celoAlfajores,
    holesky,
    mantleSepoliaTestnet,
];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
    [holesky.id]: http(),
    [mantleSepoliaTestnet.id]: http(),
};

export const SUPPORTED_CHAIN_ICONS: Record<SupportedChain, FunctionComponent> =
    {
        [SupportedChain.CeloAlfajores]: CeloIcon,
        [SupportedChain.Holesky]: EthIcon,
        [SupportedChain.MantleSepolia]: MantleIcon,
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
    [SupportedChain.MantleSepolia]: [
        {
            address: "0xb1eda18c1b730a973dac2ec37cfd5685d7de10dd",
            chainId: SupportedChain.MantleSepolia,
            decimals: 18,
            name: "Wrapped Mantle",
            symbol: "WMNT",
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
    [SupportedChain.MantleSepolia]: {
        "0xb1eda18c1b730a973dac2ec37cfd5685d7de10dd":
            "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
    },
};

export const SUPPORTED_AMMS: Record<SupportedChain, Amm[]> = {
    [SupportedChain.CeloAlfajores]: [
        {
            slug: SupportedAmm.Univ3,
            logo: UniswapLogo,
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
            logo: AlgebraIntegralLogo,
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
    [SupportedChain.MantleSepolia]: [
        {
            slug: SupportedAmm.Swapsicle,
            logo: SwapsicleIcon,
            name: "Swapsicle",
            addLiquidityUrl:
                "https://app.swapsicle.io/liquidity/v3/mantle-testnet/{target_pool}",
            subgraphClient: new AmmSubgraphClient(
                SupportedChain.MantleSepolia,
                SupportedAmm.Swapsicle,
                "https://api.goldsky.com/api/public/project_clycovfaomj6c0105c8bg8ohg/subgraphs/metrom-swapsicle-mantle-sepolia/0.2.0/gn",
            ),
        },
    ],
};

export const CHAIN_DATA = buildChainData();

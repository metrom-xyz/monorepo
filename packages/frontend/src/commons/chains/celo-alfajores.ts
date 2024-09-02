import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { UniswapLogo } from "../../assets/uniswap-logo";
import { CeloIcon } from "../../assets/celo-icon";
import { ENVIRONMENT } from "../environment";
import { METROM_SUBGRAPHS } from "../subgraphs";

export const celoAlfajoresData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.CeloAlfajores]!,
    icon: CeloIcon,
    metromSubgraphUrl:
        METROM_SUBGRAPHS[ENVIRONMENT][SupportedChain.CeloAlfajores],
    amms: [
        {
            slug: SupportedAmm.Univ3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            addLiquidityUrl: "https://app.uniswap.org/add/{target_pool}",
            poolExplorerUrl:
                "https://app.uniswap.org/explore/pools/celo_alfajores/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
            decimals: 18,
            name: "Celo",
            symbol: "CELO",
        },
        {
            address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
            decimals: 18,
            name: "Celo Dollar",
            symbol: "cUSD",
        },
        {
            address: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
            decimals: 18,
            name: "Celo Euro",
            symbol: "cEUR",
        },
    ],
    rewardTokenIcons: {
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

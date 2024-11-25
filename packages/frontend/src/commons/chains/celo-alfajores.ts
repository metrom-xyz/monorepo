import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { UniswapLogo } from "../../assets/logos/dexes/uniswap";
import { CeloLogo } from "../../assets/logos/chains/celo";
import { celoAlfajores } from "viem/chains";

export const celoAlfajoresData: ChainData = {
    name: celoAlfajores.name,
    metromContract: ADDRESS[SupportedChain.CeloAlfajores],
    blockExplorers: celoAlfajores.blockExplorers,
    icon: CeloLogo,
    dexes: [
        {
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            addLiquidityUrl: "https://app.uniswap.org/add/{target_pool}",
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
};

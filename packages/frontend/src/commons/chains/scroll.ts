import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ScrollLogo } from "../../assets/logos/chains/scroll";
import { ScribeLogo } from "../../assets/logos/dexes/scribe";
import { type ChainData } from "..";
import { scroll } from "viem/chains";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";

export const scrollData: ChainData = {
    metromContract: ADDRESS[SupportedChain.Scroll],
    blockExplorers: scroll.blockExplorers,
    icon: ScrollLogo,
    dexes: [
        {
            slug: SupportedDex.Scribe,
            logo: ScribeLogo,
            name: "Scribe",
            addLiquidityUrl:
                "https://app.scribe.exchange/pools/v4/{target_pool}",
        },
        {
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            addLiquidityUrl:
                "https://app.uniswap.org/explore/pools/scroll/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0xf55bec9cafdbe8730f096aa55dad6d22d44099df",
            decimals: 6,
            name: "Tether USD",
            symbol: "USDT",
        },
        {
            address: "0x3c1bca5a656e69edcd0d4e36bebb3fcdaca60cf1",
            decimals: 8,
            name: "Wrapped BTC",
            symbol: "WBTC",
        },
        {
            address: "0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97",
            decimals: 18,
            name: "DAI Stablecoin",
            symbol: "DAI",
        },
        {
            address: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0x5300000000000000000000000000000000000004",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0xd29687c813D741E2F938F4aC377128810E217b1b",
            decimals: 18,
            name: "Scroll",
            symbol: "SCR",
        },
    ],
};

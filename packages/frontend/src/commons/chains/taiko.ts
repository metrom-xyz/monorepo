import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "..";
import { TaikoLogo } from "@/src/assets/logos/chains/taiko";
import { PankoLogo } from "@/src/assets/logos/dexes/panko";
import { taiko } from "viem/chains";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { UnagiLogo } from "@/src/assets/logos/dexes/unagi";
import { ProtocolType } from "@/src/types";

export const taikoData: ChainData = {
    name: "Taiko",
    metromContract: ADDRESS[SupportedChain.Taiko],
    blockExplorers: taiko.blockExplorers,
    icon: TaikoLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Panko,
            logo: PankoLogo,
            name: "Panko",
            addLiquidityUrl: "https://panko.finance/add/{target_pool}",
            supportsFetchAllPools: true,
        },
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            addLiquidityUrl: "https://oku.trade/info/taiko/pool/{target_pool}",
            supportsFetchAllPools: true,
        },
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Unagi,
            logo: UnagiLogo,
            name: "Unagi",
            addLiquidityUrl:
                "https://unagiswap.xyz/pool/create/amm/v3?from={target_token_0}&to={target_token_1}",
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0xc4C410459fbaF8f7F86b6cEE52b4fA1282FF9704",
            symbol: "WBTC",
            name: "Wrapped BTC",
            decimals: 8,
        },
        {
            address: "0x7d02A3E0180451B17e5D7f29eF78d06F8117106C",
            symbol: "DAI",
            name: "DAI Stablecoin",
            decimals: 18,
        },
        {
            address: "0x07d83526730c7438048D55A4fc0b850e2aaB6f0b",
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
        },
        {
            address: "0xA9d23408b9bA935c230493c40C73824Df71A0975",
            symbol: "TAIKO",
            name: "Taiko Token",
            decimals: 18,
        },
        {
            address: "0xA51894664A773981C6C112C43ce576f315d5b1B6",
            symbol: "WETH",
            name: "Wrapped Ether",
            decimals: 18,
        },
    ],
};

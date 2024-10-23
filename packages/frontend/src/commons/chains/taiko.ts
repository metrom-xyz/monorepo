import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "..";
import { TaikoLogo } from "@/src/assets/logos/chains/taiko";
import { PankoLogo } from "@/src/assets/logos/dexes/panko";
import { taiko } from "viem/chains";

export const taikoData: ChainData = {
    metromContract: ADDRESS[SupportedChain.Taiko],
    blockExplorers: taiko.blockExplorers,
    icon: TaikoLogo,
    dexes: [
        {
            slug: SupportedDex.Panko,
            logo: PankoLogo,
            name: "Panko",
            // TODO: update this
            addLiquidityUrl: "https://panko.finance",
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

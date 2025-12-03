import { arbitrum } from "viem/chains";
import { ChainData } from "../types/chains";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { ArbitrumLogo, UniswapLogo } from "../assets";
import { BaseCampaignType, SupportedDex } from "@metrom-xyz/sdk";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const arbitrumData: ChainData = {
    active: false,
    name: arbitrum.name,
    metromContract: ADDRESS[SupportedChain.ArbitrumOne],
    blockExplorers: arbitrum.blockExplorers,
    icon: ArbitrumLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathTokenAddresses,
                template:
                    "https://app.uniswap.org/explore/pools/base_sepolia/{pool}",
            },
            supportsFetchAllPools: false,
        },
    ],
    baseTokens: [
        {
            address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
            decimals: 8,
            name: "Wrapped BTC",
            symbol: "WBTC",
        },
    ],
};

import { arbitrum } from "viem/chains";
import { ChainData } from "../types/chains";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { ArbitrumLogo, PloutosLogo, UniswapLogo } from "../assets";
import {
    BaseCampaignType,
    ChainType,
    SupportedAaveV3,
    SupportedDex,
    TargetType,
} from "@metrom-xyz/sdk";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const arbitrumData: ChainData = {
    active: true,
    id: arbitrum.id,
    type: ChainType.Evm,
    name: arbitrum.name,
    slug: "arbitrum",
    metromContract: ADDRESS[SupportedChain.ArbitrumOne],
    blockExplorers: arbitrum.blockExplorers,
    icon: ArbitrumLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
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
                type: DepositUrlType.PathPoolAddress,
                template:
                    "https://app.uniswap.org/explore/pools/arbitrum/{pool}",
            },
            supportsFetchAllPools: false,
        },
        {
            active: true,
            type: ProtocolType.AaveV3,
            slug: SupportedAaveV3.Ploutos,
            logo: PloutosLogo,
            name: "Ploutos",
            markets: [
                {
                    address: "0xa4753a119b2272047bef65850898eb603283aae9",
                    name: "Ploutos Arbitrum market",
                    slug: "ploutos",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]:
                    "https://app.ploutos.money/?marketName=proto_arbitrum_v3",
                [TargetType.AaveV3Supply]:
                    "https://app.ploutos.money/?marketName=proto_arbitrum_v3",
                [TargetType.AaveV3NetSupply]:
                    "https://app.ploutos.money/?marketName=proto_arbitrum_v3",
                // FIXME: this action is specific to aave-aptos
                [TargetType.AaveV3BridgeAndSupply]: "",
            },
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

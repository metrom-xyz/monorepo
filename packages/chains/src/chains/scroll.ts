import {
    BaseCampaignType,
    ChainType,
    PartnerCampaignType,
    SupportedDex,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ScrollLogo } from "../assets/logos/chains/scroll";
import { scroll } from "viem/chains";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { AmbientLogo, HoneypopLogo, QuillLogo } from "../assets";

export const scrollData: ChainData = {
    active: true,
    id: scroll.id,
    type: ChainType.Evm,
    name: scroll.name,
    slug: "scroll",
    metromContract: ADDRESS[SupportedChain.Scroll],
    blockExplorers: scroll.blockExplorers,
    icon: ScrollLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: false,
            partner: true,
            type: PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity,
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
                template: "https://oku.trade/uniswap/v3/liquidity/sonic/{pool}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Ambient,
            logo: AmbientLogo,
            name: "Ambient",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://ambient.finance/trade/pool/chain=0x82750&tokenA={token_0}&tokenB={token_1}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Honeypop,
            logo: HoneypopLogo,
            name: "Honeypop",
            depositUrl: {
                type: DepositUrlType.PathTokenAddresses,
                template: "https://honeypop.app/add/{pool}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: false,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Quill,
            logo: QuillLogo,
            name: "Quill",
            debtToken: {
                address: "0xdb9e8f82d6d45fff803161f2a5f75543972b229a",
                decimals: 18,
                name: "USDQ",
                symbol: "USDQ",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]: "https://app.quill.finance/borrow",
                [TargetType.LiquityV2StabilityPool]:
                    "https://app.quill.finance/earn",
            },
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

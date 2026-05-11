import { EthLogo } from "../assets/logos/chains/eth";
import { mainnet } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
    SupportedDex,
    SupportedLiquidityProviderDeal,
    SupportedLiquityV2,
    SupportedOdyssey,
    SupportedTurtleDeal,
    TargetType,
} from "@metrom-xyz/sdk";
import {
    CurveLogo,
    EbisuLogo,
    TurtleDarkLogo,
    TurtleLightLogo,
} from "../assets";
import { OdysseyLogo } from "../assets/logos/odyssey";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";

export const mainnetData: ChainData = {
    active: true,
    id: mainnet.id,
    type: ChainType.Evm,
    name: mainnet.name,
    slug: "ethereum",
    metromContract: ADDRESS[SupportedChain.Mainnet],
    blockExplorers: mainnet.blockExplorers,
    icon: EthLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.LiquityV2,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Ebisu,
            logo: EbisuLogo,
            name: "Ebisu",
            debtToken: {
                address: "0x09fd37d9aa613789c517e76df1c53aece2b60df4",
                decimals: 18,
                name: "ebUSD",
                symbol: "ebUSD",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]: "https://ebisu.money/borrow",
                [TargetType.LiquityV2StabilityPool]: "https://ebisu.money/earn",
            },
        },
        {
            active: false,
            type: ProtocolType.Dex,
            slug: SupportedDex.Curve,
            logo: CurveLogo,
            name: "Curve",
            depositUrl: {
                template: "https://www.curve.finance/dex/ethereum/pools",
                type: DepositUrlType.PathPoolAddress,
            },
            supportsFetchAllPools: true,
        },
        {
            type: ProtocolType.LiquidityProviderDeal,
            active: false,
            logo: TurtleDarkLogo,
            logoLight: TurtleLightLogo,
            name: "Turtle Club",
            slug: SupportedLiquidityProviderDeal.Turtle,
            deal: SupportedTurtleDeal.TurtleKatana,
            actionUrl:
                "https://app.turtle.xyz/earn/partners/e791ff11-980c-4d1c-9da4-43474ce69b9a",
        },
        {
            type: ProtocolType.Odyssey,
            active: false,
            logo: OdysseyLogo,
            name: "Odyssey",
            slug: SupportedOdyssey.Odyssey,
            strategies: [],
        },
    ],
    baseTokens: [
        {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            symbol: "USDC",
            name: "USDC",
            decimals: 6,
        },
    ],
};

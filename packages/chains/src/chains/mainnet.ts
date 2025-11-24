import { EthLogo } from "../assets/logos/chains/eth";
import { mainnet } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import {
    SupportedDex,
    SupportedLiquidityProviderDeal,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";
import {
    CurveLogo,
    EbisuLogo,
    TurtleDarkLogo,
    TurtleLightLogo,
} from "../assets";

// This is required for the Turtle integration and for dynamic points campaigns
export const mainnetData: ChainData = {
    active: false,
    name: mainnet.name,
    metromContract: { address: "0x" },
    blockExplorers: mainnet.blockExplorers,
    icon: EthLogo,
    forms: [],
    protocols: [
        {
            active: false,
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
            actionUrl: "https://app.turtle.xyz/campaigns/katana",
        },
    ],
    baseTokens: [],
};

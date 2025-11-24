import { zeroAddress } from "viem";
import {
    KatanaLogo,
    ProtocolType,
    TurtleDarkLogo,
    TurtleLightLogo,
    type ChainData,
} from "..";
import { katana } from "viem/chains";
import { SupportedLiquidityProviderDeal } from "@metrom-xyz/sdk";

export const katanaData: ChainData = {
    active: false,
    name: katana.name,
    metromContract: {
        address: zeroAddress,
    },
    blockExplorers: null,
    icon: KatanaLogo,
    forms: [],
    protocols: [
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

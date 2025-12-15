import { zeroAddress } from "viem";
import {
    KatanaLogo,
    ProtocolType,
    TurtleDarkLogo,
    TurtleLightLogo,
    type ChainData,
} from "..";
import { katana } from "viem/chains";
import {
    ChainType,
    SupportedLiquidityProviderDeal,
    SupportedTurtleDeal,
} from "@metrom-xyz/sdk";

export const katanaData: ChainData = {
    active: false,
    id: katana.id,
    type: ChainType.Evm,
    name: katana.name,
    slug: "katana",
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
            deal: SupportedTurtleDeal.TurtleKatana,
            actionUrl:
                "https://app.turtle.xyz/earn/partners/e791ff11-980c-4d1c-9da4-43474ce69b9a",
        },
    ],
    baseTokens: [],
};

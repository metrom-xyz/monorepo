import {
    ChainType,
    SupportedLiquidityProviderDeal,
    SupportedTurtleDeal,
} from "@metrom-xyz/sdk";
import { linea } from "viem/chains";
import type { ChainData } from "../types/chains";
import { ProtocolType } from "../types/protocol";
import { zeroAddress } from "viem";
import { LineaLogo, TurtleDarkLogo, TurtleLightLogo } from "../assets";

export const lineaData: ChainData = {
    active: false,
    id: linea.id,
    type: ChainType.Evm,
    name: "Linea",
    slug: "linea",
    metromContract: {
        address: zeroAddress,
    },
    blockExplorers: linea.blockExplorers,
    icon: LineaLogo,
    forms: [],
    protocols: [
        {
            type: ProtocolType.LiquidityProviderDeal,
            active: false,
            logo: TurtleDarkLogo,
            logoLight: TurtleLightLogo,
            name: "Turtle Club",
            slug: SupportedLiquidityProviderDeal.Turtle,
            deal: SupportedTurtleDeal.TurtleLinea,
            actionUrl:
                "https://app.turtle.xyz/earn/partners/987929cb-50d1-49b6-8400-8e7f5f4f1d45",
        },
    ],
    baseTokens: [],
};

import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ModeLogo } from "../assets/logos/chains/mode";
import { mode } from "viem/chains";
import type { ChainData } from "../types/chains";

export const modeData: ChainData = {
    testnet: false,
    name: "Mode",
    metromContract: ADDRESS[SupportedChain.Mode],
    blockExplorers: mode.blockExplorers,
    icon: ModeLogo,
    protocols: [],
    baseTokens: [
        {
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x6863fb62Ed27A9DdF458105B507C15b5d741d62e",
            decimals: 18,
            name: "KIM Token",
            symbol: "KIM",
        },
    ],
};

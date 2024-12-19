import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SonicLogo } from "@/src/assets/logos/chains/sonic";
import { type ChainData } from "..";
import { sonic } from "viem/chains";

export const sonicData: ChainData = {
    name: sonic.name,
    metromContract: ADDRESS[SupportedChain.Sonic],
    blockExplorers: {
        default: {
            name: "Sonicscan",
            url: "https://sonicscan.org",
        },
    },
    icon: SonicLogo,
    dexes: [],
    baseTokens: [],
};

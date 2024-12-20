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
    baseTokens: [
        {
            address: "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
    ],
};

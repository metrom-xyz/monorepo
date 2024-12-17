import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SonicLogo } from "@/src/assets/logos/chains/sonic";
import { type ChainData } from "..";
import { defineChain } from "viem";

export const sonicBlazeTestnet = defineChain({
    id: 57_054,
    name: "Sonic Blaze Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Sonic",
        symbol: "S",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.blaze.soniclabs.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Sonicscan",
            url: "https://testnet.sonicscan.org",
        },
    },
    contracts: {
        multicall3: {
            address: "0xcA11bde05977b3631167028862bE2a173976CA11",
            blockCreated: 1100,
        },
    },
});

export const sonicBlazeTestnetData: ChainData = {
    name: sonicBlazeTestnet.name,
    metromContract: ADDRESS[SupportedChain.SonicBlazeTestnet],
    blockExplorers: {
        default: {
            name: "Sonicscan",
            url: "https://testnet.sonicscan.org",
        },
    },
    icon: SonicLogo,
    dexes: [],
    baseTokens: [],
};

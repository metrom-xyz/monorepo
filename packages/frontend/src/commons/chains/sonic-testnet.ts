import { SupportedChain } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { SonicLogo } from "@/src/assets/logos/chains/sonic";
import { ENVIRONMENT } from "../env";
import { type ChainData } from "..";
import { defineChain } from "viem";

export const sonicTestnet = defineChain({
    id: 64_165,
    name: "Sonic Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Sonic",
        symbol: "S",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.testnet.soniclabs.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Sonic testnet",
            url: "https://testnet.soniclabs.com",
        },
    },
    contracts: {
        multicall3: {
            address: "0xcA11bde05977b3631167028862bE2a173976CA11",
            blockCreated: 71_624_484,
        },
    },
});

export const sonicTestnetData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.SonicTestnet]!,
    icon: SonicLogo,
    amms: [],
    baseTokens: [],
    rewardTokenIcons: {},
};

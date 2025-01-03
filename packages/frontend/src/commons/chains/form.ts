import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "..";
import { defineChain } from "viem";
import { FormLogo } from "@/src/assets/logos/chains/form";
import { FibonacciLogo } from "@/src/assets/logos/dexes/fibonacci";

export const form = defineChain({
    id: 478,
    name: "Form",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.form.network/http"],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://explorer.form.network/",
        },
    },
    contracts: {
        multicall3: {
            address: "0xcA11bde05977b3631167028862bE2a173976CA11",
            blockCreated: 1_214_281,
        },
    },
});

export const formData: ChainData = {
    name: form.name,
    metromContract: ADDRESS[SupportedChain.Form],
    blockExplorers: form.blockExplorers,
    icon: FormLogo,
    dexes: [
        {
            slug: SupportedDex.Fibonacci,
            logo: FibonacciLogo,
            name: "Fibonacci",
            addLiquidityUrl:
                "https://www.fibonacci-dex.xyz/pools/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0xFBf489bb4783D4B1B2e7D07ba39873Fb8068507D",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0xFA3198ecF05303a6d96E57a45E6c815055D255b1",
            decimals: 6,
            name: "USDT",
            symbol: "USDT",
        },
    ],
};

import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ArtheraLogo } from "@/src/assets/logos/chains/arthera";
import { type ChainData } from "..";
import { defineChain } from "viem";
import { SupportedDex } from "@metrom-xyz/sdk";
import { ThirdTradeLogo } from "@/src/assets/logos/dexes/thirdtrade";

export const artheraTestnet = defineChain({
    id: 10_243,
    name: "Arthera Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "AA",
        symbol: "AA",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc-test.arthera.net"],
        },
    },
    blockExplorers: {
        default: {
            name: "Arthera testnet",
            url: "https://explorer-test.arthera.net",
        },
    },
    contracts: {
        multicall3: {
            address: "0xcA11bde05977b3631167028862bE2a173976CA11",
            blockCreated: 22_051,
        },
    },
});

export const artheraTestnetData: ChainData = {
    name: artheraTestnet.name,
    metromContract: ADDRESS[SupportedChain.ArtheraTestnet],
    blockExplorers: {
        default: {
            name: "Arthera Testnet",
            url: "https://explorer-test.arthera.net",
        },
    },
    icon: ArtheraLogo,
    dexes: [
        {
            slug: SupportedDex.ThirdTrade,
            logo: ThirdTradeLogo,
            name: "Third Trade",
            addLiquidityUrl: "https://testnet.third.trade/pool/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0xa98Af7f325207BD96070E2BdCf2b7267e88330Dd",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x95Bf186929194099899139Ff79998cC147290F28",
            decimals: 18,
            name: "Test DAI",
            symbol: "tDAI",
        },
    ],
};

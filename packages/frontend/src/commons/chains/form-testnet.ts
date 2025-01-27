import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "..";
import { defineChain } from "viem";
import { FormLogo } from "@/src/assets/logos/chains/form";
import { FibonacciLogo } from "@/src/assets/logos/dexes/fibonacci";
import { ProtocolType } from "@/src/types";

export const formTestnet = defineChain({
    id: 132_902,
    name: "Form Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://testnet-rpc.form.network/http"],
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
            blockCreated: 71_624_484,
        },
    },
});

export const formTestnetData: ChainData = {
    name: formTestnet.name,
    metromContract: ADDRESS[SupportedChain.FormTestnet],
    blockExplorers: formTestnet.blockExplorers,
    icon: FormLogo,
    protocols: {
        [ProtocolType.Dex]: [
            {
                slug: SupportedDex.Fibonacci,
                logo: FibonacciLogo,
                name: "Fibonacci",
                addLiquidityUrl:
                    "https://www.fibonacci-dex.xyz/pool/{target_pool}",
                supportsFetchAllPools: true,
            },
        ],
        [ProtocolType.LiquityV2Brand]: [],
    },
    baseTokens: [
        {
            address: "0xA65be6D7DE4A82Cc9638FB3Dbf8E68b7f2e757ab",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0xaC96dbABb398ee0c49660049590a6e5527Ae581F",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
    ],
};

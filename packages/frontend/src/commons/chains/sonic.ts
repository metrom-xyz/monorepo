import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SupportedDex } from "@metrom-xyz/sdk";
import { SonicLogo } from "@/src/assets/logos/chains/sonic";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { SilverSwapLogo } from "@/src/assets/logos/dexes/silverswap";
import { type ChainData } from "..";
import { sonic } from "viem/chains";
import { ProtocolType } from "@/src/types";

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
    protocols: {
        [ProtocolType.Dex]: [
            {
                slug: SupportedDex.UniswapV3,
                logo: UniswapLogo,
                name: "Uniswap v3",
                addLiquidityUrl:
                    "https://app.uniswap.org/explore/pools/sonic/{target_pool}",
                supportsFetchAllPools: true,
            },
            {
                slug: SupportedDex.SilverSwap,
                logo: SilverSwapLogo,
                name: "SilverSwap",
                addLiquidityUrl:
                    "https://silverswap.io/chain/sonic/liquidity/add-v3",
                supportsFetchAllPools: true,
            },
        ],
        [ProtocolType.LiquityV2Brand]: [],
    },
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

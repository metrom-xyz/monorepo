import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SupportedDex } from "@metrom-xyz/sdk";
import { SonicLogo } from "../assets/logos/chains/sonic";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";
import { SilverSwapLogo } from "../assets/logos/dexes/silverswap";
import { sonic } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const sonicData: ChainData = {
    active: true,
    name: sonic.name,
    metromContract: ADDRESS[SupportedChain.Sonic],
    blockExplorers: {
        default: {
            name: "Sonicscan",
            url: "https://sonicscan.org",
        },
    },
    icon: SonicLogo,
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/sonic/liquidity/{pool}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: false,
            type: ProtocolType.Dex,
            slug: SupportedDex.SilverSwap,
            logo: SilverSwapLogo,
            name: "SilverSwap",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://silverswap.io/chain/sonic/liquidity/add-v3",
            },
            supportsFetchAllPools: true,
        },
    ],
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

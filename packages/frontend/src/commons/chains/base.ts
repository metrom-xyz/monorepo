import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../../assets/logos/chains/base";
import { KimLogo } from "../../assets/logos/dexes/kim";
import { BaseSwapLogo } from "@/src/assets/logos/dexes/baseswap";
import { type ChainData } from "..";
import { base } from "viem/chains";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { ProtocolType } from "@/src/types";

export const baseData: ChainData = {
    name: base.name,
    metromContract: ADDRESS[SupportedChain.Base],
    blockExplorers: base.blockExplorers,
    icon: BaseLogo,
    protocols: {
        [ProtocolType.Dex]: [
            {
                slug: SupportedDex.Kim,
                logo: KimLogo,
                name: "Kim",
                addLiquidityUrl:
                    "https://app.kim.exchange/pools/v4/{target_pool}",
                supportsFetchAllPools: true,
            },
            {
                slug: SupportedDex.BaseSwap,
                logo: BaseSwapLogo,
                name: "BaseSwap",
                addLiquidityUrl: `https://baseswap.fi/pool/v3/${SupportedChain.Base}-{target_pool}`,
                supportsFetchAllPools: true,
            },
            {
                slug: SupportedDex.UniswapV3,
                logo: UniswapLogo,
                name: "Uniswap v3",
                addLiquidityUrl: `https://app.uniswap.org/explore/pools/${SupportedChain.Base}/{target_pool}`,
                supportsFetchAllPools: false,
            },
        ],
        [ProtocolType.LiquityV2Brand]: [],
    },
    baseTokens: [
        {
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
            decimals: 8,
            name: "Wrapped BTC",
            symbol: "BTC",
        },
        {
            address: "0x5dC25aA049837B696d1dc0F966aC8DF1491f819B",
            decimals: 18,
            name: "KIM",
            symbol: "KIM",
        },
        {
            address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
            decimals: 18,
            name: "DAI Stablecoin",
            symbol: "DAI",
        },
    ],
};

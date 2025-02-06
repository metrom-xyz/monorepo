import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../../assets/logos/chains/mantle";
import { SwapsicleLogo } from "../../assets/logos/dexes/swapsicle";
import { type ChainData } from "..";
import { mantle } from "viem/chains";
import { ProtocolType } from "@/src/types";

export const mantleData: ChainData = {
    name: mantle.name,
    metromContract: ADDRESS[SupportedChain.Mantle],
    blockExplorers: mantle.blockExplorers,
    icon: MantleLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Swapsicle,
            logo: SwapsicleLogo,
            name: "Swapsicle",
            addLiquidityUrl:
                "https://app.swapsicle.io/liquidity/v3/mantle/{target_pool}",
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
            decimals: 18,
            name: "Wrapped Mantle",
            symbol: "WMNT",
        },
        {
            address: "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
            decimals: 18,
            name: "Ether",
            symbol: "WETH",
        },
        {
            address: "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
            decimals: 6,
            name: "Tether USD",
            symbol: "USDT",
        },
    ],
};

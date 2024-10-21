import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../../assets/logos/chains/mantle";
import { SwapsicleLogo } from "../../assets/logos/dexes/swapsicle";
import { type ChainData } from "..";

export const mantleSepoliaData: ChainData = {
    metromContract: ADDRESS[SupportedChain.MantleSepolia],
    icon: MantleLogo,
    dexes: [
        {
            slug: SupportedDex.Swapsicle,
            logo: SwapsicleLogo,
            name: "Swapsicle",
            addLiquidityUrl:
                "https://app.swapsicle.io/liquidity/v3/mantle-testnet/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0xb1eda18c1b730a973dac2ec37cfd5685d7de10dd",
            decimals: 18,
            name: "Wrapped Mantle",
            symbol: "WMNT",
        },
    ],
};

import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../../assets/logos/chains/mantle";
import { SwapsicleLogo } from "../../assets/logos/dexes/swapsicle";
import { type ChainData } from "..";
import { mantleSepoliaTestnet } from "viem/chains";
import { ProtocolType } from "@/src/types";

export const mantleSepoliaData: ChainData = {
    name: "Mantle Sepolia",
    metromContract: ADDRESS[SupportedChain.MantleSepolia],
    blockExplorers: mantleSepoliaTestnet.blockExplorers,
    icon: MantleLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Swapsicle,
            logo: SwapsicleLogo,
            name: "Swapsicle",
            addLiquidityUrl:
                "https://app.swapsicle.io/liquidity/v3/mantle-testnet/{target_pool}",
            supportsFetchAllPools: true,
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

import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../../assets/logos/chains/mantle";
import { SwapsicleLogo } from "../../assets/logos/amms/swapsicle";
import { ENVIRONMENT } from "../env";
import { type ChainData } from "..";

export const mantleSepoliaData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.MantleSepolia]!,
    icon: MantleLogo,
    amms: [
        {
            slug: SupportedAmm.Swapsicle,
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
    rewardTokenIcons: {
        "0xb1eda18c1b730a973dac2ec37cfd5685d7de10dd":
            "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
        "0xc8e265d4c037b0e0641c84b440ab260f4fdafd24":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        "0xd1d3cf05ef211c71056f0af1a7fd1df989e109c3":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
};

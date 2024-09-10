import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../../assets/logos/chains/mantle";
import { SwapsicleLogo } from "../../assets/logos/amms/swapsicle";
import { ENVIRONMENT } from "../env";
import { type ChainData } from "..";

export const mantleData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.Mantle]!,
    icon: MantleLogo,
    amms: [
        {
            slug: SupportedAmm.Swapsicle,
            logo: SwapsicleLogo,
            name: "Swapsicle",
            addLiquidityUrl:
                "https://app.swapsicle.io/liquidity/v3/mantle/{target_pool}",
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
    rewardTokenIcons: {
        "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8":
            "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
};

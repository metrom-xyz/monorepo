import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { ModeLogo } from "../../assets/logos/chains/mode";
import { KimLogo } from "../../assets/logos/amms/kim";
import { KimToken } from "@/src/assets/logos/tokens/kim";
import { UsdcToken } from "@/src/assets/logos/tokens/usdc";
import { UsdtToken } from "@/src/assets/logos/tokens/usdt";
import { ENVIRONMENT } from "../env";
import { type ChainData } from "..";

export const modeData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.Mode]!,
    icon: ModeLogo,
    amms: [
        {
            slug: SupportedAmm.Kim,
            logo: KimLogo,
            name: "Kim",
            addLiquidityUrl: "https://app.kim.exchange/pools/v4/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x6863fb62Ed27A9DdF458105B507C15b5d741d62e",
            decimals: 18,
            name: "KIM Token",
            symbol: "KIM",
        },
    ],
    rewardTokenIcons: {
        "0x4200000000000000000000000000000000000006":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    specialTokens: {
        "0x6863fb62ed27a9ddf458105b507c15b5d741d62e": KimToken,
        "0xdfc7c877a950e49d2610114102175a06c2e3167a": ModeLogo,
        "0xd988097fb8612cc24eec14542bc03424c656005f": UsdcToken,
        "0xf0f161fda2712db8b566946122a5af183995e2ed": UsdtToken,
    },
};

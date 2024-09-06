import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { ModeLogo } from "../../assets/logos/chains/mode";
import { KimLogo } from "../../assets/logos/amms/kim";
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
    ],
    rewardTokenIcons: {
        "0x4200000000000000000000000000000000000006":
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
};

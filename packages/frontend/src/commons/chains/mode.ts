import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { ModeIcon } from "../../assets/mode-icon";
import { KimIcon } from "../../assets/kim-icon";
import { ENVIRONMENT } from "../environment";
import { type ChainData } from "..";
import { METROM_SUBGRAPHS } from "../subgraphs";

export const modeData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.Mode]!,
    icon: ModeIcon,
    metromSubgraphUrl: METROM_SUBGRAPHS[ENVIRONMENT][SupportedChain.Mode],
    amms: [
        {
            slug: SupportedAmm.Kim,
            logo: KimIcon,
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

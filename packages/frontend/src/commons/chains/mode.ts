import { SupportedAmm } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ModeLogo } from "../../assets/logos/chains/mode";
import { KimLogo } from "../../assets/logos/amms/kim";
import { type ChainData } from "..";

export const modeData: ChainData = {
    metromContract: ADDRESS[SupportedChain.Mode],
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
};

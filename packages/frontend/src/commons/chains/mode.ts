import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { ModeLogo } from "../../assets/logos/chains/mode";
import { KimLogo } from "../../assets/logos/dexes/kim";
import { type ChainData } from "..";
import { mode } from "viem/chains";
import { DepositUrlType, ProtocolType } from "@/src/types/common";

export const modeData: ChainData = {
    name: "Mode",
    metromContract: ADDRESS[SupportedChain.Mode],
    blockExplorers: mode.blockExplorers,
    icon: ModeLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Kim,
            logo: KimLogo,
            name: "Kim",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://app.kim.exchange/pools/v4/{pool}",
            },
            supportsFetchAllPools: true,
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

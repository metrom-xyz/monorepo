import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SupportedDex } from "@metrom-xyz/sdk";
import { sei } from "viem/chains";
import { SeiLogo } from "../assets/logos/chains/sei";
import { CarbonLogo } from "../assets/logos/dexes/carbon";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const seiData: ChainData = {
    active: true,
    name: sei.name,
    metromContract: ADDRESS[SupportedChain.Sei],
    blockExplorers: {
        default: {
            name: "SeiTrace",
            url: "https://seitrace.com/",
        },
    },
    icon: SeiLogo,
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Carbon,
            logo: CarbonLogo,
            name: "Carbon DeFi",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://sei.carbondefi.xyz/trade/disposable?base={token0}&quote={token1}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8",
            decimals: 18,
            name: "Bridged Wrapped Ether (Stargate)",
            symbol: "WETH",
        },
        {
            address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0xA0fB8cd450c8Fd3a11901876cD5f17eB47C6bc50",
            decimals: 18,
            name: "WSEI",
            symbol: "WSEI",
        },
    ],
};

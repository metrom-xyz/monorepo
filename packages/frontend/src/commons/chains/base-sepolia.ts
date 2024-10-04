import { SupportedAmm } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../../assets/logos/chains/base";
import { KimLogo } from "../../assets/logos/amms/kim";
import { type ChainData } from "..";

export const baseSepoliaData: ChainData = {
    metromContract: ADDRESS[SupportedChain.BaseSepolia],
    icon: BaseLogo,
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
            address: "0xe82c4D8b993D613a28600B953e91A3A93Ae69Fd6",
            decimals: 18,
            name: "Test DAI",
            symbol: "tDAI",
        },
        {
            address: "0xBbB06b25484AB9E23FEe8Ee321Af8e253ea7A76a",
            decimals: 6,
            name: "Test USDC",
            symbol: "tUSDC",
        },
    ],
};

import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../../assets/logos/chains/base";
import { KimLogo } from "../../assets/logos/dexes/kim";
import { type ChainData } from "..";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { baseSepolia } from "viem/chains";
import { DepositUrlType, ProtocolType } from "@/src/types/common";

export const baseSepoliaData: ChainData = {
    testnet: true,
    name: baseSepolia.name,
    metromContract: ADDRESS[SupportedChain.BaseSepolia],
    blockExplorers: baseSepolia.blockExplorers,
    icon: BaseLogo,
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
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathTokenAddresses,
                template:
                    "https://app.uniswap.org/explore/pools/base_sepolia/{pool}",
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

import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { baseSepolia } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { BaseLogo } from "../assets/logos/chains/base";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";

export const baseSepoliaData: ChainData = {
    active: true,
    reimbursementFeeEnabled: false,
    name: baseSepolia.name,
    metromContract: ADDRESS[SupportedChain.BaseSepolia],
    blockExplorers: baseSepolia.blockExplorers,
    icon: BaseLogo,
    protocols: [
        {
            active: true,
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

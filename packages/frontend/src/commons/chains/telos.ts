import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SupportedDex } from "@metrom-xyz/sdk";
import { TelosLogo } from "@/src/assets/logos/chains/telos";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { type ChainData } from "..";
import { telos } from "viem/chains";
import { DepositUrlType, ProtocolType } from "@/src/types/protocol";

export const telosData: ChainData = {
    testnet: false,
    name: telos.name,
    metromContract: ADDRESS[SupportedChain.Telos],
    blockExplorers: {
        default: {
            name: "Teloscan",
            url: "https://teloscan.io",
        },
    },
    icon: TelosLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/telos/liquidity/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E",
            decimals: 18,
            name: "Wrapped TLOS",
            symbol: "WTLOS",
        },
        {
            address: "0x8D97Cea50351Fb4329d591682b148D43a0C3611b",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0xA0fB8cd450c8Fd3a11901876cD5f17eB47C6bc50",
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
    ],
};

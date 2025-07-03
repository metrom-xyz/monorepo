import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { SupportedDex } from "@metrom-xyz/sdk";
import {
    DepositUrlType,
    HemiLogo,
    ProtocolType,
    UniswapLogo,
    type ChainData,
} from "..";
import { hemi } from "viem/chains";

export const hemiData: ChainData = {
    active: true,
    reimbursementFeeEnabled: false,
    name: hemi.name,
    metromContract: ADDRESS[SupportedChain.Hemi],
    blockExplorers: hemi.blockExplorers,
    icon: HemiLogo,
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/hemi/liquidity/{pool}",
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
            address: "0xbB0D083fb1be0A9f6157ec484b6C79E0A4e31C2e",
            decimals: 6,
            name: "USDT",
            symbol: "USDT",
        },
        {
            address: "0xad11a8BEb98bbf61dbb1aa0F6d6F2ECD87b35afA",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
    ],
};

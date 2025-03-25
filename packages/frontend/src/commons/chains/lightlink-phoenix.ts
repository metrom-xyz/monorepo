import { SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { LightLinkPhoenixLogo } from "../../assets/logos/chains/lightlink-phoenix";
import { type ChainData } from "..";
import { lightlinkPhoenix } from "viem/chains";
import { UniswapLogo } from "@/src/assets/logos/dexes/uniswap";
import { DepositUrlType, ProtocolType } from "@/src/types/common";

export const lightlinkPhoenixData: ChainData = {
    testnet: false,
    name: "LightLink",
    metromContract: ADDRESS[SupportedChain.LightLinkPhoenix],
    blockExplorers: lightlinkPhoenix.blockExplorers,
    icon: LightLinkPhoenixLogo,
    protocols: [
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/lightlink/pool/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x7EbeF2A4b1B09381Ec5B9dF8C5c6f2dBECA59c73",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
    ],
};

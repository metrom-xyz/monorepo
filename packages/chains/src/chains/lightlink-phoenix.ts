import { BaseCampaignType, SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { LightLinkPhoenixLogo } from "../assets/logos/chains/lightlink-phoenix";
import { lightlinkPhoenix } from "viem/chains";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const lightlinkPhoenixData: ChainData = {
    active: true,
    name: "LightLink",
    metromContract: ADDRESS[SupportedChain.LightLinkPhoenix],
    blockExplorers: lightlinkPhoenix.blockExplorers,
    icon: LightLinkPhoenixLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/lightlink/liquidity/{pool}",
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
        {
            address: "0xd9d7123552fA2bEdB2348bB562576D67f6E8e96E",
            decimals: 18,
            name: "LightLink",
            symbol: "LL.e",
        },
        {
            address: "0x808d7c71ad2ba3FA531b068a2417C63106BC0949",
            decimals: 6,
            name: "Tether USD (Stargate Bridged)",
            symbol: "USDT",
        },
        {
            address: "0xbCF8C1B03bBDDA88D579330BDF236B58F8bb2cFd",
            decimals: 6,
            name: "Bridged USDC (Stargate)",
            symbol: "USDC.e",
        },
    ],
};

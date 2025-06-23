import { SupportedDex } from "@metrom-xyz/sdk";
import { GnosisLogo } from "../assets/logos/chains/gnosis";
import { gnosis } from "viem/chains";
import { SwaprLogo } from "../assets/logos/dexes/swapr";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { UniswapLogo } from "../assets";

export const gnosisData: ChainData = {
    active: true,
    name: gnosis.name,
    metromContract: ADDRESS[SupportedChain.Gnosis],
    blockExplorers: gnosis.blockExplorers,
    icon: GnosisLogo,
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Swapr,
            logo: SwaprLogo,
            name: "Swapr",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://v3.swapr.eth.limo/#/info/pools/{pool}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/gnosis/liquidity/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
            symbol: "GNO",
            name: "Gnosis Token on xDai",
            decimals: 18,
        },
        {
            address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
            symbol: "WXDAI",
            name: "Wrapped XDAI",
            decimals: 18,
        },
        {
            address: "0xaf204776c7245bF4147c2612BF6e5972Ee483701",
            symbol: "sDAI",
            name: "Savings xDAI",
            decimals: 18,
        },
        {
            address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
            symbol: "USDT",
            name: "Tether USD on xDAI",
            decimals: 6,
        },
        {
            address: "0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0",
            symbol: "USDC.e",
            name: "Bridged USDC (Gnosis)",
            decimals: 6,
        },
        {
            address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
            symbol: "USDC",
            name: "USD//C on xDai",
            decimals: 6,
        },
        {
            address: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
            symbol: "WETH",
            name: "Wrapped Ether on xDai",
            decimals: 18,
        },
    ],
};

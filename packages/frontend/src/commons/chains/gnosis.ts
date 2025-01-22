import { SupportedDex } from "@metrom-xyz/sdk";
import { type ChainData } from "..";
import { GnosisLogo } from "@/src/assets/logos/chains/gnosis";
import { gnosis } from "viem/chains";
import { SwaprLogo } from "@/src/assets/logos/dexes/swapr";

export const gnosisData: ChainData = {
    name: gnosis.name,
    // TODO: once the contracts library is upgraded use ADDRESS[SupportedChain.Gnosis]
    metromContract: {
        address: "0x9430990117A7451e3d0a3d89796FC0b0c294Da9c",
        blockCreated: 38018174,
    },
    blockExplorers: gnosis.blockExplorers,
    icon: GnosisLogo,
    dexes: [
        {
            slug: SupportedDex.Swapr,
            logo: SwaprLogo,
            name: "Swapr",
            addLiquidityUrl:
                "https://v3.swapr.eth.limo/#/info/pools/{target_pool}",
        },
    ],
    liquityV2Brands: [],
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

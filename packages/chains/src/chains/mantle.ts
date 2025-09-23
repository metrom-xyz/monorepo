import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { MantleLogo } from "../assets/logos/chains/mantle";
import { mantle } from "viem/chains";
import type { ChainData } from "../types/chains";
import { TargetType } from "@metrom-xyz/sdk";

export const mantleData: ChainData = {
    active: false,
    name: mantle.name,
    metromContract: ADDRESS[SupportedChain.Mantle],
    blockExplorers: mantle.blockExplorers,
    icon: MantleLogo,
    protocols: [],
    partnerActions: [
        {
            active: true,
            type: TargetType.JumperWhitelistedAmmPoolLiquidity,
        },
    ],
    baseTokens: [
        {
            address: "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
            decimals: 18,
            name: "Wrapped Mantle",
            symbol: "WMNT",
        },
        {
            address: "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
            decimals: 18,
            name: "Ether",
            symbol: "WETH",
        },
        {
            address: "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae",
            decimals: 6,
            name: "Tether USD",
            symbol: "USDT",
        },
    ],
};

import { bsc } from "viem/chains";
import { ChainData } from "../types/chains";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { BscLogo, UniswapLogo } from "../assets";
import { BaseCampaignType, ChainType, SupportedDex } from "@metrom-xyz/sdk";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const bscData: ChainData = {
    active: true,
    id: bsc.id,
    type: ChainType.Evm,
    name: bsc.name,
    slug: "bsc",
    metromContract: ADDRESS[SupportedChain.Bsc],
    blockExplorers: bsc.blockExplorers,
    icon: BscLogo,
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
                type: DepositUrlType.PathTokenAddresses,
                template: "https://app.uniswap.org/explore/pools/bsc/{pool}",
            },
            supportsFetchAllPools: false,
        },
    ],
    baseTokens: [
        {
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            decimals: 18,
            name: "Binance-Peg BUSD Token",
            symbol: "BUSD",
        },
        {
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            decimals: 18,
            name: "Binance-Peg USD Coin",
            symbol: "USDC",
        },
    ],
};

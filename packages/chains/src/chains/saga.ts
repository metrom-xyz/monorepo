import { BaseCampaignType, ChainType, SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { saga } from "viem/chains";
import type { ChainData } from "../types/chains";
import { SagaLogo, UniswapLogo } from "../assets";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const sagaData: ChainData = {
    active: true,
    id: saga.id,
    type: ChainType.Evm,
    name: "Saga EVM",
    slug: "saga",
    metromContract: ADDRESS[SupportedChain.Saga],
    blockExplorers: saga.blockExplorers,
    icon: SagaLogo,
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
                template: "https://oku.trade/info/saga/pool/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0xfc960C233B8E98e0Cf282e29BDE8d3f105fc24d5",
            decimals: 6,
            name: "USD Coin",
            symbol: "USDC",
        },
        {
            address: "0xeb41D53F14Cb9a67907f2b8b5DBc223944158cCb",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0xC8fe3C1de344854f4429bB333AFFAeF97eF88CEa",
            decimals: 6,
            name: "Tether USD",
            symbol: "USDT",
        },
    ],
};

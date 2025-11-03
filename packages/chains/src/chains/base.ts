import {
    BaseCampaignType,
    PartnerCampaignType,
    SupportedDex,
} from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../assets/logos/chains/base";
import { BaseSwapLogo } from "../assets/logos/dexes/baseswap";
import { base } from "viem/chains";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { KimLogo } from "../assets";
import { HydrexLogo } from "../assets/logos/dexes/hydrex";

export const baseData: ChainData = {
    active: true,
    name: base.name,
    metromContract: ADDRESS[SupportedChain.Base],
    blockExplorers: base.blockExplorers,
    icon: BaseLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: false,
            partner: true,
            type: PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity,
        },
    ],
    protocols: [
        {
            active: false,
            type: ProtocolType.Dex,
            slug: SupportedDex.Kim,
            logo: KimLogo,
            name: "Kim",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://app.kim.exchange/pools/v4/{pool}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.BaseSwap,
            logo: BaseSwapLogo,
            name: "BaseSwap",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: `https://baseswap.fi/pool/v3/${SupportedChain.Base}-{pool}`,
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Hydrex,
            logo: HydrexLogo,
            name: "Hydrex",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://www.hydrex.fi/liquidity/{pool}/create",
            },
            supportsFetchAllPools: true,
        },
        {
            active: false,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/base/liquidity/{pool}",
            },
            supportsFetchAllPools: false,
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
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
            decimals: 8,
            name: "Wrapped BTC",
            symbol: "BTC",
        },
        {
            address: "0x5dC25aA049837B696d1dc0F966aC8DF1491f819B",
            decimals: 18,
            name: "KIM",
            symbol: "KIM",
        },
        {
            address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
            decimals: 18,
            name: "DAI Stablecoin",
            symbol: "DAI",
        },
    ],
};

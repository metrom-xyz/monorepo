import {
    BaseCampaignType,
    ChainType,
    PartnerCampaignType,
    SupportedDex,
    SupportedYieldSeeker,
} from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../assets/logos/chains/base";
import { base } from "viem/chains";
import { UniswapLogo } from "../assets/logos/dexes/uniswap";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { HydrexLogo } from "../assets/logos/dexes/hydrex";
import { BalancerLogo } from "../assets/logos/dexes/balancer";
import { QuickswapLogo } from "../assets/logos/dexes/quickswap";
import { YieldSeekerLogo } from "../assets/logos/yield-seeker";

export const baseData: ChainData = {
    active: true,
    id: base.id,
    type: ChainType.Evm,
    name: base.name,
    slug: "base",
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
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://app.uniswap.org/explore/pools/base/{pool}",
            },
            supportsFetchAllPools: false,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.BalancerV3,
            logo: BalancerLogo,
            name: "Balancer v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://balancer.fi/pools/base/v3/{pool}",
            },
            supportsFetchAllPools: false,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Quickswap,
            logo: QuickswapLogo,
            name: "Quickswap",
            depositUrl: {
                type: DepositUrlType.PathTokenAddresses,
                template:
                    "https://dapp.quickswap.exchange/pool/v4/{pool}?chainId=8453",
            },
            supportsFetchAllPools: true,
        },
        {
            active: false,
            type: ProtocolType.YieldSeeker,
            slug: SupportedYieldSeeker.YieldSeeker,
            logo: YieldSeekerLogo,
            name: "Yield Seeker",
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

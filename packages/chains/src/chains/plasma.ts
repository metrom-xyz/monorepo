import { BaseCampaignType, ChainType, SupportedDex, SupportedLiquityV2, TargetType } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { plasma } from "viem/chains";
import type { ChainData } from "../types/chains";
import { BalancerLogo, EbisuLogo, LithosLogo, PlasmaLogo } from "../assets";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const plasmaData: ChainData = {
    active: true,
    id: plasma.id,
    type: ChainType.Evm,
    name: plasma.name,
    slug: "plasma",
    metromContract: ADDRESS[SupportedChain.Plasma],
    blockExplorers: plasma.blockExplorers,
    icon: PlasmaLogo,
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
            slug: SupportedDex.BalancerV3,
            logo: BalancerLogo,
            name: "Balancer v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://balancer.fi/pools/plasma/v3/{pool}",
            },
            supportsFetchAllPools: false,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Lithos,
            logo: LithosLogo,
            name: "Lithos",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://lithos.to/pools/deposit?token0={token_0}&token1={token_1}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: false,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Ebisu,
            logo: EbisuLogo,
            name: "Ebisu",
            debtToken: {
                address: "0xef7b1a03e0897c33b63159e38d779e3970c0e2fc",
                decimals: 18,
                name: "ebUSD",
                symbol: "ebUSD",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]: "https://ebisu.money/borrow",
                [TargetType.LiquityV2StabilityPool]: "https://ebisu.money/earn",
            },
        },
    ],
    baseTokens: [],
};

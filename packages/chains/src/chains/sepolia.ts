import { EthLogo } from "../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { sepolia } from "viem/chains";
import {
    BaseCampaignType,
    SupportedDex,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";
import { LiquityLogo } from "../assets/logos/liquity-v2-platforms/liquity";
import { EbisuLogo } from "../assets/logos/liquity-v2-platforms/ebisu";
import { CarbonLogo } from "../assets/logos/dexes/carbon";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { BalancerLogo } from "../assets/logos/dexes/balancer";

export const sepoliaData: ChainData = {
    active: true,
    name: sepolia.name,
    metromContract: ADDRESS[SupportedChain.Sepolia],
    blockExplorers: sepolia.blockExplorers,
    icon: EthLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.LiquityV2,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Liquity,
            logo: LiquityLogo,
            name: "Liquity",
            debtToken: {
                address: "0xb01d32c05f4aa066eef2bfd4d461833fddd56d0a",
                decimals: 18,
                name: "Bold Stablecoin",
                symbol: "BOLD",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]:
                    "https://liquity2-sepolia.vercel.app/borrow",
                [TargetType.LiquityV2StabilityPool]:
                    "https://liquity2-sepolia.vercel.app/earn",
            },
        },
        {
            active: true,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Ebisu,
            logo: EbisuLogo,
            name: "Ebisu",
            debtToken: {
                address: "0xA4E721039da9e14332Fec14F98f463D92623149A",
                decimals: 18,
                name: "ebUSD",
                symbol: "ebUSD",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]:
                    "https://liquity2-sepolia.vercel.app/borrow",
                [TargetType.LiquityV2StabilityPool]:
                    "https://liquity2-sepolia.vercel.app/earn",
            },
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Carbon,
            logo: CarbonLogo,
            name: "Carbon DeFi",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://app.carbondefi.xyz/trade/disposable?base={token0}&quote={token1}",
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.BalancerV3,
            logo: BalancerLogo,
            name: "Balancer v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://balancer.fi/pools/sepolia/v2/{pool}",
            },
            supportsFetchAllPools: false,
        },
    ],
    baseTokens: [
        {
            address: "0xA80A089DE4720F8cffA34DAC70f6B648832A0DDb",
            decimals: 18,
            symbol: "DAI",
            name: "DAI",
        },
        {
            address: "0x8116d0a0e8d4f0197b428c520953f302adca0b50",
            decimals: 18,
            symbol: "ETH",
            name: "Ether",
        },
        {
            address: "0xbdb72f78302e6174e48aa5872f0dd986ed6d98d9",
            decimals: 18,
            symbol: "rETH",
            name: "Rocket pool eth",
        },
        {
            address: "0xff9f477b09c6937ff6313ae90e79022609851a9c",
            decimals: 18,
            symbol: "wstETH",
            name: "Wrapped liquid staked Ether",
        },
        {
            address: "0xee8448abed49f5fe7f9c6670e572d463d308d76e",
            decimals: 18,
            symbol: "WETH",
            name: "Wrapped Ether",
        },
        {
            address: "0x874207c9693d301f74e92de3a5a045f4ecb582d2",
            decimals: 18,
            symbol: "ezETH",
            name: "Renzo Restaked Ether",
        },
        {
            address: "0x874207c9693d301f74e92de3a5a045f4ecb582d2",
            decimals: 18,
            symbol: "LINK",
            name: "Chainlink token",
        },
    ],
};

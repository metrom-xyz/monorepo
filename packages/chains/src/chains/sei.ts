import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import {
    BaseCampaignType,
    ChainType,
    PartnerCampaignType,
    SupportedDex,
} from "@metrom-xyz/sdk";
import { sei } from "viem/chains";
import { SeiLogo } from "../assets/logos/chains/sei";
import { CarbonLogo } from "../assets/logos/dexes/carbon";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const seiDevelopmentData: ChainData = {
    active: true,
    id: sei.id,
    type: ChainType.Evm,
    name: "Sei",
    slug: "sei",
    metromContract: {
        address: "0xD4AC4AaFb81eC774E49AA755A66EfCe4574D6276",
        blockCreated: 141_494_257,
    },
    blockExplorers: {
        default: {
            name: "SeiTrace",
            url: "https://seitrace.com/",
        },
    },
    icon: SeiLogo,
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
            slug: SupportedDex.Carbon,
            logo: CarbonLogo,
            name: "Carbon DeFi",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://sei.carbondefi.xyz/trade/disposable?base={token_0}&quote={token_1}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8",
            decimals: 18,
            name: "Bridged Wrapped Ether (Stargate)",
            symbol: "WETH",
        },
        {
            address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0xA0fB8cd450c8Fd3a11901876cD5f17eB47C6bc50",
            decimals: 18,
            name: "WSEI",
            symbol: "WSEI",
        },
    ],
};

export const seiProductionData: ChainData = {
    active: true,
    id: sei.id,
    type: ChainType.Evm,
    name: "Sei",
    slug: "sei",
    metromContract: ADDRESS[SupportedChain.Sei],
    blockExplorers: {
        default: {
            name: "SeiTrace",
            url: "https://seitrace.com/",
        },
    },
    icon: SeiLogo,
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
            slug: SupportedDex.Carbon,
            logo: CarbonLogo,
            name: "Carbon DeFi",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://sei.carbondefi.xyz/trade/disposable?base={token_0}&quote={token_1}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x160345fC359604fC6e70E3c5fAcbdE5F7A9342d8",
            decimals: 18,
            name: "Bridged Wrapped Ether (Stargate)",
            symbol: "WETH",
        },
        {
            address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0xA0fB8cd450c8Fd3a11901876cD5f17eB47C6bc50",
            decimals: 18,
            name: "WSEI",
            symbol: "WSEI",
        },
    ],
};

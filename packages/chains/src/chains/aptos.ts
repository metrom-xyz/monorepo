import {
    BaseCampaignType,
    ChainType,
    PartnerCampaignType,
    SupportedAaveV3,
    SupportedDex,
    TargetType,
} from "@metrom-xyz/sdk";
import {
    AaveDarkLogo,
    AaveLightLogo,
    AptosLogo,
    HyperionLogo,
} from "../assets";
import { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";

export const aptosDevelopmentData: ChainData = {
    active: true,
    id: 2,
    type: ChainType.Aptos,
    name: "Aptos Testnet",
    slug: "aptos_testnet",
    metromContract: ADDRESS[SupportedChain.Testnet],
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AptosLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
        },
        {
            active: true,
            partner: true,
            type: PartnerCampaignType.AaveV3BridgeAndSupply,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.AaveV3,
            slug: SupportedAaveV3.Aave,
            logo: AaveDarkLogo,
            logoLight: AaveLightLogo,
            name: "Aave",
            markets: [
                {
                    address:
                        "0xbd7912c555a06809c2e385eab635ff0ef52b1fa062ce865c785c67694a12bb12",
                    name: "Aptos v3 market",
                    slug: "aptos-v3",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]: "https://aptos.aave.com/",
                [TargetType.AaveV3Supply]: "https://aptos.aave.com/",
                [TargetType.AaveV3NetSupply]: "https://aptos.aave.com/",
                [TargetType.AaveV3BridgeAndSupply]:
                    "https://stargate.finance/bridge?dstChain=aptos&dstToken={collateral}",
            },
        },
    ],
    baseTokens: [],
};

// Aptos production deployment for the development environment
export const aptosDevelopmentProductionData: ChainData = {
    active: true,
    id: 1,
    type: ChainType.Aptos,
    name: "Aptos",
    slug: "aptos",
    metromContract: {
        address:
            "0x493e77803da878852618f16be3867fdf328734b89a35fe15cf39a0cfb070246d",
        blockCreated: 432012827,
    },
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AptosLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: false,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
        },
        {
            active: true,
            partner: true,
            type: PartnerCampaignType.AaveV3BridgeAndSupply,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Hyperion,
            logo: HyperionLogo,
            name: "Hyperion",
            supportsFetchAllPools: true,
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://hyperion.xyz/pool/{pool}",
            },
        },
        {
            active: true,
            type: ProtocolType.AaveV3,
            slug: SupportedAaveV3.Aave,
            logo: AaveDarkLogo,
            logoLight: AaveLightLogo,
            name: "Aave",
            markets: [
                {
                    address:
                        "0x39ddcd9e1a39fa14f25e3f9ec8a86074d05cc0881cbf667df8a6ee70942016fb",
                    name: "Aptos v3 market",
                    slug: "aptos-v3",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]: "https://aptos.aave.com/",
                [TargetType.AaveV3Supply]: "https://aptos.aave.com/",
                [TargetType.AaveV3NetSupply]: "https://aptos.aave.com/",
                [TargetType.AaveV3BridgeAndSupply]:
                    "https://stargate.finance/bridge?dstChain=aptos&dstToken={collateral}",
            },
        },
    ],
    baseTokens: [],
};

export const aptosProductionData: ChainData = {
    active: true,
    id: 1,
    type: ChainType.Aptos,
    name: "Aptos",
    slug: "aptos",
    metromContract: ADDRESS[SupportedChain.Mainnet],
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AptosLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
        },
        {
            active: false,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
        },
        {
            active: true,
            partner: true,
            type: PartnerCampaignType.AaveV3BridgeAndSupply,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.AaveV3,
            slug: SupportedAaveV3.Aave,
            logo: AaveDarkLogo,
            logoLight: AaveLightLogo,
            name: "Aave",
            markets: [
                {
                    address:
                        "0x39ddcd9e1a39fa14f25e3f9ec8a86074d05cc0881cbf667df8a6ee70942016fb",
                    name: "Aptos v3 market",
                    slug: "aptos-v3",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]: "https://aptos.aave.com/",
                [TargetType.AaveV3Supply]: "https://aptos.aave.com/",
                [TargetType.AaveV3NetSupply]: "https://aptos.aave.com/",
                [TargetType.AaveV3BridgeAndSupply]:
                    "https://stargate.finance/bridge?dstChain=aptos&dstToken={collateral}",
            },
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Hyperion,
            logo: HyperionLogo,
            name: "Hyperion",
            supportsFetchAllPools: true,
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://hyperion.xyz/pool/{pool}",
            },
        },
    ],
    baseTokens: [],
};

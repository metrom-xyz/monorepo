import { SupportedAaveV3, TargetType } from "@metrom-xyz/sdk";
import { AaveDarkLogo, AaveLightLogo, AptosLogo } from "../assets";
import { ChainData } from "../types/chains";
import { ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";

export const aptosDevelopmentData: ChainData = {
    active: true,
    name: "Aptos Testnet",
    metromContract: ADDRESS[SupportedChain.Testnet],
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AptosLogo,
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
                [TargetType.AaveV3BridgeAndSupply]: "https://stargate.finance/",
            },
        },
    ],
    baseTokens: [],
};

// Aptos production deployment for the development environment
export const aptosDevelopmentProductionData: ChainData = {
    active: true,
    name: "Aptos",
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
    ],
    baseTokens: [],
};

export const aptosProductionData: ChainData = {
    active: true,
    name: "Aptos",
    metromContract: ADDRESS[SupportedChain.Mainnet],
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AptosLogo,
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
    ],
    baseTokens: [],
};

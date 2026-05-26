import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
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
import { AmmPoolDepositUrlType, ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";
import { ThalaLogo } from "../assets/logos/dexes/thala";

export const aptosData: ChainData = {
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
            type: BaseCampaignType.AmmPoolLiquidity,
            distributables: [DistributablesType.Tokens],
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
            distributables: [DistributablesType.Tokens],
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
                type: AmmPoolDepositUrlType.PathPoolAddress,
                template: "https://hyperion.xyz/pool/{pool}",
            },
        },
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Thala,
            logo: ThalaLogo,
            name: "Thala",
            supportsFetchAllPools: true,
            depositUrl: {
                type: AmmPoolDepositUrlType.PathPoolAddress,
                template: "https://app.thala.fi/pools/{pool}",
            },
        },
    ],
    baseTokens: [
        {
            address:
                "0x000000000000000000000000000000000000000000000000000000000000000a",
            symbol: "APT",
            name: "Aptos Coin",
            decimals: 8,
        },
        {
            address:
                "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
            symbol: "USDC",
            name: "USDC",
            decimals: 6,
        },
        {
            address:
                "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
            symbol: "USDT",
            name: "Tether USD",
            decimals: 6,
        },
    ],
};

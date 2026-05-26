import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
    SupportedAaveV3,
    TargetType,
} from "@metrom-xyz/sdk";
import { AaveDarkLogo, AaveLightLogo, AptosLogo } from "../assets";
import { ChainData } from "../types/chains";
import { ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";

export const aptosTestnetData: ChainData = {
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

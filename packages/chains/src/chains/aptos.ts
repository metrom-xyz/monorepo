import { SupportedAaveV3, SupportedDex, TargetType } from "@metrom-xyz/sdk";
import {
    AaveDarkLogo,
    AaveLightLogo,
    AlgebraIntegralLogo,
    AptosLogo,
} from "../assets";
import { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";

export const aptosDevelopmentData: ChainData = {
    active: true,
    name: "Aptos Testnet",
    metromContract: ADDRESS[SupportedChain.Testnet],
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com/?network=testnet",
        },
    },
    icon: AptosLogo,
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.TestIntegral,
            logo: AlgebraIntegralLogo,
            name: "Algebra integral",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template:
                    "https://integral.algebra.finance/pool/{pool}/new-position",
            },
            supportsFetchAllPools: true,
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
                        "0xbd7912c555a06809c2e385eab635ff0ef52b1fa062ce865c785c67694a12bb12",
                    name: "Aptos v3 market",
                    slug: "aptos-v3",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]: "",
                [TargetType.AaveV3Supply]: "",
                [TargetType.AaveV3NetSupply]: "",
            },
        },
    ],
    baseTokens: [],
};

export const aptosProductionData: ChainData = {
    active: true,
    name: "Aptos",
    // TODO: add metrom contract
    metromContract: { address: "0x" },
    blockExplorers: { default: { name: "", url: "" } },
    icon: AptosLogo,
    protocols: [],
    baseTokens: [],
};

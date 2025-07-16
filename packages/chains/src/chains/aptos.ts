import { SupportedDex } from "@metrom-xyz/sdk";
import { AlgebraIntegralLogo, AptosLogo } from "../assets";
import { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { ADDRESS, SupportedChain } from "@metrom-xyz/aptos-contracts";

export const aptosDevelopmentData: ChainData = {
    active: true,
    name: "Aptos Devnet",
    metromContract: ADDRESS[SupportedChain.Devnet],
    blockExplorers: { default: { name: "", url: "" } },
    icon: AptosLogo,
    protocols: [
        // FIXME: add proper supported protocols
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
    ],
    baseTokens: [],
};

export const aptosDevelopmentTestnetData: ChainData = {
    active: true,
    name: "Aptos Testnet",
    // TODO: add metrom contract
    metromContract: {
        address: "0x",
    },
    blockExplorers: { default: { name: "", url: "" } },
    icon: AptosLogo,
    protocols: [],
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

import { ChainType } from "@metrom-xyz/sdk";
import { AptosLogo } from "../assets";
import { ChainData } from "../types/chains";
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
    forms: [],
    protocols: [],
    baseTokens: [],
};

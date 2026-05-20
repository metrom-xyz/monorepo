import { PROGRAM_ID, SupportedChain } from "@metrom-xyz/programs-solana";
import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
} from "@metrom-xyz/sdk";
import { ChainData } from "../types/chains";
import { SolanaLogo } from "../assets";
import { Address } from "viem";

export const solanaDevelopmentData: ChainData = {
    active: true,
    id: SupportedChain.Testnet,
    type: ChainType.Svm,
    name: "Solana Testnet",
    slug: "solana:testnet",
    metromContract: {
        address: PROGRAM_ID.toString() as Address,
    },
    blockExplorers: {
        default: {
            name: "Solana Explorer",
            url: "https://explorer.solana.com/",
        },
    },
    icon: SolanaLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [],
    baseTokens: [],
};

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
    id: SupportedChain.Devnet,
    type: ChainType.Svm,
    name: "Solana Devnet",
    slug: "solana:devnet",
    metromContract: {
        address: PROGRAM_ID.toString() as Address,
    },
    blockExplorers: {
        default: {
            name: "Solana Explorer",
            url: "https://solscan.io",
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
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [],
    baseTokens: [],
};

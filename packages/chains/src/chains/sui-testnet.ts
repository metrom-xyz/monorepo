import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
} from "@metrom-xyz/sdk";
import { ChainData } from "../types/chains";
import { SupportedChain, ADDRESS } from "@metrom-xyz/sui-contracts";
import { SuiLogo } from "../assets";

export const suiTestnetData: ChainData = {
    active: true,
    id: SupportedChain.Testnet,
    type: ChainType.Sui,
    name: "Sui Testnet",
    slug: "testnet",
    metromContract: {
        address: ADDRESS[SupportedChain.Testnet].packageId,
        stateAddress: ADDRESS[SupportedChain.Testnet].stateObjectId,
        blockCreated:
            ADDRESS[SupportedChain.Testnet].checkpointSequenceNumberCreated,
    },
    blockExplorers: {
        default: {
            name: "Sui Explorer",
            url: "https://suiscan.xyz/testnet",
        },
    },
    icon: SuiLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
            distributables: [
                DistributablesType.Tokens,
                DistributablesType.FixedPoints,
            ],
        },
    ],
    protocols: [],
    baseTokens: [],
};

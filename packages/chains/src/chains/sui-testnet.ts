import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
    SupportedDex,
} from "@metrom-xyz/sdk";
import { ChainData } from "../types/chains";
import { SupportedChain, ADDRESS } from "@metrom-xyz/sui-contracts";
import { CetusLogo, SuiLogo } from "../assets";
import { AmmPoolDepositUrlType, ProtocolType } from "../types/protocol";

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
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Cetus,
            logo: CetusLogo,
            name: "Cetus",
            depositUrl: {
                type: AmmPoolDepositUrlType.PathPoolAddress,
                template: "https://app.cetus.zone/clmm?poolAddress={pool}",
            },
            supportsFetchAllPools: false,
        },
    ],
    baseTokens: [],
};

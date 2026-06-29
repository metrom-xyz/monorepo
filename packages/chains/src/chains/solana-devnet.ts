import { PROGRAM_ID, SupportedChain } from "@metrom-xyz/programs-solana";
import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
    SupportedDex,
} from "@metrom-xyz/sdk";
import { ChainData } from "../types/chains";
import { OrcaLogo, SolanaLogo } from "../assets";
import { Address } from "viem";
import { AmmPoolDepositUrlType, ProtocolType } from "../types/protocol";

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
            distributables: [
                DistributablesType.Tokens,
                DistributablesType.FixedPoints,
            ],
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Orca,
            logo: OrcaLogo,
            name: "Orca",
            depositUrl: {
                type: AmmPoolDepositUrlType.QueryTokenAddresses,
                template:
                    "https://www.orca.so/pools?chainId=solanaDevnet&tokens={token_0}&tokens={token_1}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [],
};

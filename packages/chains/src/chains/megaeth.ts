import { megaeth } from "viem/chains";
import { ChainData } from "../types/chains";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { MegaEthLogo, PurrlendLogo } from "../assets";
import {
    BaseCampaignType,
    ChainType,
    SupportedAaveV3,
    TargetType,
} from "@metrom-xyz/sdk";
import { ProtocolType } from "../types/protocol";

export const megaethData: ChainData = {
    active: true,
    id: megaeth.id,
    type: ChainType.Evm,
    name: megaeth.name,
    slug: "megaeth",
    metromContract: ADDRESS[SupportedChain.MegaEth],
    blockExplorers: megaeth.blockExplorers,
    icon: MegaEthLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AaveV3,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.AaveV3,
            slug: SupportedAaveV3.Purrlend,
            logo: PurrlendLogo,
            name: "Purrlend",
            markets: [
                {
                    address: "0x402d38c3415ad92a0e766e1491dc222871b1df7a",
                    name: "MegaETH market",
                    slug: "megaeth",
                },
            ],
            actionUrls: {
                [TargetType.AaveV3Borrow]: "https://app.purrlend.io/",
                [TargetType.AaveV3Supply]: "https://app.purrlend.io/",
                [TargetType.AaveV3NetSupply]: "https://app.purrlend.io/",
                [TargetType.AaveV3BridgeAndSupply]: "https://app.purrlend.io/",
            },
        },
    ],
    baseTokens: [
        {
            address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
            decimals: 18,
            name: "Ethena USD",
            symbol: "USDE",
        },
    ],
};

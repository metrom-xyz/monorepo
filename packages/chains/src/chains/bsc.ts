import { bsc } from "viem/chains";
import { ChainData } from "../types/chains";
import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
} from "@metrom-xyz/sdk";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { BscLogo } from "../assets";

export const bscData: ChainData = {
    active: false,
    id: bsc.id,
    type: ChainType.Evm,
    name: bsc.name,
    slug: "bsc",
    metromContract: ADDRESS[SupportedChain.Bsc],
    blockExplorers: bsc.blockExplorers,
    icon: BscLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [],
    baseTokens: [
        {
            address: "0x55d398326f99059fF775485246999027B3197955",
            decimals: 18,
            name: "Tether USD",
            symbol: "USDT",
        },
        {
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            decimals: 18,
            name: "USD Coin",
            symbol: "USDC",
        },
    ],
};

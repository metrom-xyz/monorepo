import { megaeth } from "viem/chains";
import { ChainData } from "../types/chains";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { MegaEthLogo } from "../assets";
import { ChainType } from "@metrom-xyz/sdk";

export const megaethData: ChainData = {
    active: true,
    id: megaeth.id,
    type: ChainType.Evm,
    name: megaeth.name,
    slug: "megaeth",
    metromContract: ADDRESS[SupportedChain.MegaEth],
    blockExplorers: megaeth.blockExplorers,
    icon: MegaEthLogo,
    forms: [],
    protocols: [],
    baseTokens: [
        {
            address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
            decimals: 18,
            name: "Ethena USD",
            symbol: "USDE",
        },
    ],
};

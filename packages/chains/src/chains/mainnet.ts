import { EthLogo } from "../assets/logos/chains/eth";
import { mainnet } from "viem/chains";
import type { ChainData } from "../types/chains";

// This is required for the Turtle integration
export const mainnetData: ChainData = {
    active: false,
    reimbursementFeeEnabled: false,
    name: mainnet.name,
    metromContract: { address: "0x" },
    blockExplorers: mainnet.blockExplorers,
    icon: EthLogo,
    protocols: [],
    baseTokens: [],
};

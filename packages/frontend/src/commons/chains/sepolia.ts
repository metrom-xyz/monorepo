import { EthLogo } from "../../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { sepolia } from "viem/chains";

export const sepoliaData: ChainData = {
    name: sepolia.name,
    metromContract: ADDRESS[SupportedChain.Sepolia],
    blockExplorers: sepolia.blockExplorers,
    icon: EthLogo,
    dexes: [],
    baseTokens: [],
};

import type { SupportedChain } from "@metrom-xyz/contracts";
import { useChainId } from "wagmi";
import { CHAIN_DATA, type ChainData } from "../commons";

export function useChainData(): ChainData {
    const chainId: SupportedChain = useChainId();

    return CHAIN_DATA[chainId];
}

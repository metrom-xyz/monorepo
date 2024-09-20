import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_DATA, type ChainData } from "../commons";

export function useChainData(chainId?: number): ChainData | null {
    return chainId ? CHAIN_DATA[chainId as SupportedChain] : null;
}

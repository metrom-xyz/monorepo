import { CHAIN_DATA, type ChainData } from "../commons";

export function useChainData(chainId?: number): ChainData | null {
    return chainId ? CHAIN_DATA[chainId] : null;
}

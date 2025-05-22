import { type ChainData } from "@metrom-xyz/chains-data";
import { getChainData } from "../utils/chain";

export function useChainData(chainId?: number): ChainData | null {
    if (!chainId) return null;
    return getChainData(chainId);
}

import { type ChainData } from "@metrom-xyz/chains";
import { getCrossVmChainData } from "../utils/chain";
import { useChainType } from "../context/chain-type";

export function useChainData(chainId?: number): ChainData | null {
    const { chainType } = useChainType();

    if (!chainId) return null;
    return getCrossVmChainData(chainId, chainType) || null;
}

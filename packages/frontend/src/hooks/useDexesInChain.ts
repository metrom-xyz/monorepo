import type { DexInfo } from "../types";
import { useChainData } from "./useChainData";

export function useDexesInChain(chainId?: number): DexInfo[] {
    const chainData = useChainData(chainId);

    return chainData ? chainData.dexes.map((dex) => ({ ...dex })) : [];
}

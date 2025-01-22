import type { DexInfo } from "../types";
import { useChainData } from "./useChainData";

export function useDexesInChain(chainId?: number): DexInfo[] {
    const chainData = useChainData(chainId);

    if (!chainData) return [];

    return chainData.dexes.map((dex) => ({
        slug: dex.slug,
        name: dex.name,
        logo: dex.logo,
    }));
}

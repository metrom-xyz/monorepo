import type { Token } from "@metrom-xyz/sdk";
import { useChainData } from "./useChainData";

export function useBaseTokens(): Token[] {
    const chainData = useChainData();

    return chainData.baseTokens;
}

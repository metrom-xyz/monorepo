import type { Erc20Token } from "@metrom-xyz/sdk";
import { useChainData } from "./useChainData";

export function useBaseTokens(chainId?: number): Erc20Token[] {
    const chainData = useChainData(chainId);
    return chainData ? chainData.baseTokens : [];
}

import type { BaseErc20Token } from "@metrom-xyz/sdk";
import { useChainData } from "./useChainData";

export function useBaseTokens(chainId?: number): BaseErc20Token[] {
    const chainData = useChainData({ chainId });
    return chainData ? chainData.baseTokens : [];
}

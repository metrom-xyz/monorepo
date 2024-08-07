import type { Token, SupportedChain } from "@metrom-xyz/sdk";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";

export function useBaseTokens(): Token[] {
    const chainId: SupportedChain = useChainId();
    return CHAIN_DATA[chainId].baseTokens;
}

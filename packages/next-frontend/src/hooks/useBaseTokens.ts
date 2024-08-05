import type { Erc20Token, SupportedChain } from "@metrom-xyz/sdk";
import { useChainId } from "wagmi";
import { CHAIN_DATA } from "../commons";

export function useBaseTokens(): Erc20Token[] {
    const chainId: SupportedChain = useChainId();
    return CHAIN_DATA[chainId].baseTokens;
}

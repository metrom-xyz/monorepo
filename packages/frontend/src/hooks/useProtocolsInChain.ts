import { ProtocolType, type DexInfo, type Protocols } from "../types";
import { useChainData } from "./useChainData";

export function useProtocolsInChain<T extends ProtocolType>(
    chainId: number,
    type: T,
): Protocols[T] {
    const chainData = useChainData(chainId);
    if (!chainData) return [];

    return chainData.protocols[type].map((dex) => ({ ...dex })) as Protocols[T];
}

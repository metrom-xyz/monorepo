import {
    ProtocolType,
    type DexProtocol,
    type LiquityV2Protocol,
    type Protocol,
} from "../types";
import { useChainData } from "./useChainData";

interface ProtocolByType {
    [ProtocolType.Dex]: DexProtocol;
    [ProtocolType.LiquityV2]: LiquityV2Protocol;
}

type ProtocolsInChain<T extends ProtocolType | undefined> =
    T extends ProtocolType ? readonly ProtocolByType[T][] : readonly Protocol[];

export function useProtocolsInChain<T extends ProtocolType | undefined>(
    chainId: number,
    type?: T,
): ProtocolsInChain<T> {
    const chainData = useChainData(chainId);
    if (!chainData) return [] as unknown as ProtocolsInChain<T>;

    return (!type
        ? chainData.protocols
        : chainData.protocols.filter(
              (protocol) => protocol.type === type,
          )) as unknown as ProtocolsInChain<T>;
}

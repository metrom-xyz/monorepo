import type {
    DexProtocol,
    LiquityV2Protocol,
    Protocol,
    ProtocolType,
    WithChain,
} from "@metrom-xyz/chains";
import { useChainData } from "./useChainData";

interface ProtocolByType {
    [ProtocolType.Dex]: WithChain<DexProtocol>;
    [ProtocolType.LiquityV2]: WithChain<LiquityV2Protocol>;
}

type ProtocolsInChain<T extends ProtocolType | undefined> =
    T extends ProtocolType ? readonly ProtocolByType[T][] : readonly Protocol[];

interface UseProtocolsInChainParams<T extends ProtocolType | undefined> {
    chainId: number;
    type?: T;
    active?: boolean;
}

export function useProtocolsInChain<T extends ProtocolType | undefined>({
    chainId,
    type,
    active,
}: UseProtocolsInChainParams<T>): ProtocolsInChain<T> {
    const chainData = useChainData(chainId);
    if (!chainData) return [] as unknown as ProtocolsInChain<T>;

    const filteredProtocols = chainData.protocols.filter((protocol) => {
        if (type && protocol.type !== type) return false;
        if (active !== undefined && protocol.active !== active) return false;
        return true;
    });

    return filteredProtocols.map((protocol) => ({
        ...protocol,
        chainId,
    })) as unknown as ProtocolsInChain<T>;
}

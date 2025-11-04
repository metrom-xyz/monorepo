import type {
    AaveV3Protocol,
    DexProtocol,
    GmxV1LiquidityProtocol,
    LiquityV2Protocol,
    Protocol,
    ProtocolType,
} from "@metrom-xyz/chains";
import { useChainData } from "./useChainData";
import type { HookBaseParams, HookCrossVmParams } from "../types/hooks";
import type { ChainType } from "@metrom-xyz/sdk";

interface ProtocolByType {
    [ProtocolType.Dex]: DexProtocol;
    [ProtocolType.GmxV1Liquidity]: GmxV1LiquidityProtocol;
    [ProtocolType.LiquityV2]: LiquityV2Protocol;
    [ProtocolType.AaveV3]: AaveV3Protocol;
}

export type ProtocolsInChain<T extends ProtocolType | undefined> =
    T extends ProtocolType ? readonly ProtocolByType[T][] : readonly Protocol[];

interface UseProtocolsInChainParams<T extends ProtocolType | undefined>
    extends HookBaseParams,
        HookCrossVmParams {
    chainId: number;
    chainType?: ChainType;
    active?: boolean;
    type?: T;
}

export function useProtocolsInChain<T extends ProtocolType | undefined>({
    chainId,
    chainType,
    type,
    active,
    crossVm = false,
}: UseProtocolsInChainParams<T>): ProtocolsInChain<T> {
    const chainData = useChainData({ chainId, chainType, crossVm });
    if (!chainData) return [] as unknown as ProtocolsInChain<T>;

    const filteredProtocols = chainData.protocols.filter((protocol) => {
        if (type && protocol.type !== type) return false;
        if (active !== undefined && protocol.active !== active) return false;
        return true;
    });

    return filteredProtocols as unknown as ProtocolsInChain<T>;
}

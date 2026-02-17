import { useChainData } from "./useChainData";
import type { HookBaseParams, HookCrossVmParams } from "../types/hooks";
import type { ChainType, SupportedOdysseyStrategy } from "@metrom-xyz/sdk";
import { ProtocolType } from "@metrom-xyz/chains";

interface UseOdysseyStrategiesProps extends HookBaseParams, HookCrossVmParams {
    chainId: number;
    chainType?: ChainType;
}

// TODO: add brand filter if we will have multiple brands for odyssey
export function useOdysseyStrategies({
    chainId,
    chainType,
    crossVm = false,
}: UseOdysseyStrategiesProps): SupportedOdysseyStrategy[] {
    const chainData = useChainData({ chainId, chainType, crossVm });
    if (!chainData) return [];

    const odysseyProtocol = chainData.protocols.find(
        (protocol) => protocol.type === ProtocolType.Odyssey,
    );
    if (!odysseyProtocol) return [];

    return odysseyProtocol.strategies;
}

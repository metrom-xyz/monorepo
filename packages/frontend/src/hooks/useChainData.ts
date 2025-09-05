import { type ChainData } from "@metrom-xyz/chains";
import { getChainData, getCrossVmChainData } from "../utils/chain";
import type { HookCrossVmParams } from "../types/hooks";
import type { ChainType } from "@metrom-xyz/sdk";

interface UseChainDataParams extends HookCrossVmParams {
    chainId?: number;
    chainType?: ChainType;
}

export function useChainData({
    chainId,
    chainType,
    crossVm = false,
}: UseChainDataParams): ChainData | null {
    if (!chainId) return null;

    if (crossVm && chainType)
        return getCrossVmChainData(chainId, chainType) || null;
    return getChainData(chainId) || null;
}

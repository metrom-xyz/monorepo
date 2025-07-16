import { type ChainData } from "@metrom-xyz/chains";
import { getChainData, getCrossVmChainData } from "../utils/chain";
import type { HookCrossVmParams } from "../types/hooks";

interface UseChainDataParams extends HookCrossVmParams {
    chainId?: number;
}

export function useChainData({
    chainId,
    crossVm = false,
}: UseChainDataParams): ChainData | null {
    if (!chainId) return null;

    if (crossVm) return getCrossVmChainData(chainId) || null;
    return getChainData(chainId) || null;
}

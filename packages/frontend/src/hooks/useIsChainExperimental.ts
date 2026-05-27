import { EXPERIMENTAL_CHAINS } from "../commons/env";

export interface UseIsChainExperimentalParams {
    chainId?: number;
}

export function useIsChainExperimental({
    chainId,
}: UseIsChainExperimentalParams) {
    if (!chainId) return false;
    return EXPERIMENTAL_CHAINS.includes(chainId);
}

import type { HookBaseParams } from "@/src/types/hooks";
import { useIsChainSupportedEvm } from "./useIsChainSupportedEvm";
import { useIsChainSupportedMvm } from "./useIsChainSupportedMvm";
import { APTOS } from "@/src/commons/env";

export interface UseIsChainSupportedParams extends HookBaseParams {
    chainId?: number;
}

export function useIsChainSupported(params: UseIsChainSupportedParams) {
    const supportedEvm = useIsChainSupportedEvm({ ...params, enabled: !APTOS });
    const supportedMvm = useIsChainSupportedMvm({ ...params, enabled: APTOS });

    if (APTOS) return supportedMvm;
    return supportedEvm;
}

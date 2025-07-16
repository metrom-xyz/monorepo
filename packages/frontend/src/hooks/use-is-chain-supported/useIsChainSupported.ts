import { useIsChainSupportedEvm } from "./useIsChainSupportedEvm";
import { useIsChainSupportedMvm } from "./useIsChainSupportedMvm";
import type { UseIsChainSupportedParams } from "./types";
import { APTOS } from "@/src/commons/env";

export function useIsChainSupported(params: UseIsChainSupportedParams) {
    const supportedEvm = useIsChainSupportedEvm({ ...params, enabled: !APTOS });
    const supportedMvm = useIsChainSupportedMvm({ ...params, enabled: APTOS });

    if (APTOS) return supportedMvm;
    return supportedEvm;
}

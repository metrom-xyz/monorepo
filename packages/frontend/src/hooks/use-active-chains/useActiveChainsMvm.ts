import type { HookBaseParams } from "@/src/types/hooks";
import { useMemo } from "react";
import { SUPPORTED_CHAINS_MVM } from "@/src/commons";

export function useActiveChainsMvm({ enabled = true }: HookBaseParams = {}) {
    return useMemo(() => {
        if (!enabled) return [];
        return SUPPORTED_CHAINS_MVM;
    }, [enabled]);
}

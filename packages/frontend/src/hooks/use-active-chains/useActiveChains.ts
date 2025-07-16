import type { HookBaseParams } from "@/src/types/hooks";
import { useActiveChainsEvm } from "./useActiveChainsEvm";
import { APTOS } from "@/src/commons/env";
import { useActiveChainsMvm } from "./useActiveChainsMvm";

export function useActiveChains(params: HookBaseParams = {}) {
    const chainsEvm = useActiveChainsEvm({ ...params, enabled: !APTOS });
    const chainsMvm = useActiveChainsMvm({ ...params, enabled: APTOS });

    if (APTOS) return chainsMvm;
    return chainsEvm;
}

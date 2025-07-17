import type { HookBaseParams } from "@/src/types/hooks";
import { useWatchBlockNumberEvm } from "./useWatchBlockNumberEvm";
import { APTOS } from "@/src/commons/env";
import { useWatchBlockNumberMvm } from "./useWatchBlockNumberMvm";

export function useWatchBlockNumber(params: HookBaseParams = {}) {
    const blockNumberEvm = useWatchBlockNumberEvm({
        ...params,
        enabled: !APTOS,
    });
    const blockNumberMvm = useWatchBlockNumberMvm({
        ...params,
        enabled: APTOS,
    });

    if (APTOS) return blockNumberEvm;
    return blockNumberMvm;
}

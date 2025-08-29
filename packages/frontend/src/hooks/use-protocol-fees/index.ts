import type { HookBaseParams } from "@/src/types/hooks";
import { useProtocolFeesMvm } from "./useProtocolFeesMvm";
import { useProtocolFeesEvm } from "./useProtocolFeesEvm";
import { APTOS } from "@/src/commons/env";

export interface UseProtocolFeesParams extends HookBaseParams {}

export interface UseProtocolFeesReturnValue {
    loading: boolean;
    fee?: number;
    feeRebate?: number;
}

export function useProtocolFees(
    params: UseProtocolFeesParams = {},
): UseProtocolFeesReturnValue {
    const protocolFeesEvm = useProtocolFeesEvm({ ...params, enabled: !APTOS });
    const protocolFeesMvm = useProtocolFeesMvm({ ...params, enabled: APTOS });

    if (APTOS) return protocolFeesMvm;
    return protocolFeesEvm;
}

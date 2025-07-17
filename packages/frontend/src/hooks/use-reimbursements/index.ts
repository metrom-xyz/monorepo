import { APTOS } from "@/src/commons/env";
import { useReimbursementsEvm } from "./useReimbursementsEvm";
import { useReimbursementsMvm } from "./useReimbursementsMvm";
import type { HookBaseParams } from "@/src/types/hooks";
import type { ReimbursementsWithRemaining } from "@/src/types/campaign";

export interface UseReimbursementsParams extends HookBaseParams {}

export interface UseReimbursementsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    reimbursements?: ReimbursementsWithRemaining[];
}

export function useReimbursements(
    params: UseReimbursementsParams = {},
): UseReimbursementsReturnValue {
    const reimbursementsEvm = useReimbursementsEvm({
        ...params,
        enabled: !APTOS,
    });
    const reimbursementsMvm = useReimbursementsMvm({
        ...params,
        enabled: APTOS,
    });

    if (APTOS) return reimbursementsMvm;
    return reimbursementsEvm;
}

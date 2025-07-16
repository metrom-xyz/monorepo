import { APTOS } from "@/src/commons/env";
import type {
    UseReimbursementsParams,
    UseReimbursementsReturnValue,
} from "./types";
import { useReimbursementsEvm } from "./useReimbursementsEvm";
import { useReimbursementsMvm } from "./useReimbursementsMvm";

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

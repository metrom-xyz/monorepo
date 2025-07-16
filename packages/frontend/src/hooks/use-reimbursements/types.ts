import type { ReimbursementsWithRemaining } from "@/src/types/campaign";
import type { HookBaseParams } from "@/src/types/hooks";

export interface UseReimbursementsParams extends HookBaseParams {}

export interface UseReimbursementsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    reimbursements?: ReimbursementsWithRemaining[];
}

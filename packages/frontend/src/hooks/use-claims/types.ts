import type { ClaimWithRemaining } from "@/src/types/campaign";
import type { HookBaseParams } from "@/src/types/hooks";

export interface UseClaimsParams extends HookBaseParams {}

export interface UseClaimsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    claims?: ClaimWithRemaining[];
}

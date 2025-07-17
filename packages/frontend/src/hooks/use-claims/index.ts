import { APTOS } from "@/src/commons/env";
import { useClaimsEvm } from "./useClaimsEvm";
import { useClaimsMvm } from "./useClaimsMvm";
import type { HookBaseParams } from "@/src/types/hooks";
import type { ClaimWithRemaining } from "@/src/types/campaign";

export interface UseClaimsParams extends HookBaseParams {}

export interface UseClaimsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    claims?: ClaimWithRemaining[];
}

export function useClaims(params: UseClaimsParams = {}): UseClaimsReturnValue {
    const claimsEvm = useClaimsEvm({ ...params, enabled: !APTOS });
    const claimsMvm = useClaimsMvm({ ...params, enabled: APTOS });

    if (APTOS) return claimsMvm;
    return claimsEvm;
}

import { APTOS } from "@/src/commons/env";
import type { UseClaimsParams, UseClaimsReturnValue } from "./types";
import { useClaimsEvm } from "./useClaimsEvm";
import { useClaimsMvm } from "./useClaimsMvm";

export function useClaims(params: UseClaimsParams = {}): UseClaimsReturnValue {
    const claimsEvm = useClaimsEvm({ ...params, enabled: !APTOS });
    const claimsMvm = useClaimsMvm({ ...params, enabled: APTOS });

    if (APTOS) return claimsMvm;
    return claimsEvm;
}

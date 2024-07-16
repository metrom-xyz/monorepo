import type { ClaimWithRemaining } from "@/composables/useClaims";

export interface ClaimRowProps {
    claim: ClaimWithRemaining;
    logo?: boolean;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
}

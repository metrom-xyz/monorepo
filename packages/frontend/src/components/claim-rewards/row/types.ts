import type { Claim } from "@metrom-xyz/sdk";

export interface ClaimRowProps {
    claim: Claim;
    logo?: boolean;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
}

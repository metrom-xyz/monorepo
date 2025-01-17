import type { Address, Hex } from "viem";
import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendClaim {
    chainId: number;
    campaignId: Hex;
    token: Address;
    amount: string;
    proof: Hex[];
}

export interface BackendClaimsResponse {
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    claims: BackendClaim[];
}

export type BackendReimbursement = BackendClaim;

export interface BackendReimbursementsResponse {
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    reimbursements: BackendReimbursement[];
}

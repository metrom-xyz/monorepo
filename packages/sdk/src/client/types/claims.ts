import type { Address, Hex } from "viem";
import type { ChainType } from "src/types/commons";
import type { BackendResolvedPricedTokensRegistry } from "./commons";

export interface BackendClaim {
    chainId: number;
    chainType: ChainType;
    campaignId: Hex;
    token: Address;
    amount: string;
    proof: Hex[];
}

export interface BackendClaimsResponse {
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    claims: BackendClaim[];
}

export type BackendReimbursement = BackendClaim;

export interface BackendReimbursementsResponse {
    resolvedPricedTokens: BackendResolvedPricedTokensRegistry;
    reimbursements: BackendReimbursement[];
}

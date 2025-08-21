import type { Address, Hash, Hex } from "viem";
import type { BackendErc20Token } from "./commons";

export interface BackendActivityTransaction {
    id: Hash;
    timestamp: number;
}

export interface BackendActivityClaimReward {
    type: "claim-reward";
    token: Address;
    amount: string;
    receiver: Address;
}

export interface BackendActivityCreateCampaign {
    type: "create-campaign";
    id: Hex;
}

export interface BackendActivity {
    transaction: BackendActivityTransaction;
    payload: BackendActivityClaimReward | BackendActivityCreateCampaign;
}

export interface BackendActivitiesResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    activities: BackendActivity[];
}

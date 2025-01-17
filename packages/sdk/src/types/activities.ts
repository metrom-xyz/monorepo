import type { Address, Hash, Hex } from "viem";
import type { Erc20Token, OnChainAmount } from "./commons";

export interface ActivityTransaction {
    hash: Hash;
    timestamp: number;
}

export interface ActivityClaimReward {
    type: "claim-reward";
    token: Erc20Token;
    amount: OnChainAmount;
    receiver: Address;
}

export interface ActivityCreateCampaign {
    type: "create-campaign";
    id: Hex;
}

export interface Activity {
    transaction: ActivityTransaction;
    payload: ActivityClaimReward | ActivityCreateCampaign;
}

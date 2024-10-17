import type {
    Erc20Token,
    Pool,
    PoolWithTvl,
    Specification,
    UsdPricedErc20Token,
} from "../types";
import type { Address, Hash, Hex } from "viem";

export interface BackendReward extends UsdPricedErc20Token {
    amount: string;
    remaining: string;
}

export type BackendPool = Omit<Pool, "chainId">;

export type BackendPoolWithTvl = Omit<PoolWithTvl, "chainId">;

export interface BackendCampaign {
    chainId: number;
    id: Hex;
    from: string;
    to: string;
    createdAt: string;
    snapshottedAt: string | null;
    pool: BackendPoolWithTvl;
    specification: Specification | null;
    rewards: BackendReward[];
    apr: number | null;
}

export interface BackendClaim {
    chainId: number;
    campaignId: Hex;
    token: UsdPricedErc20Token;
    amount: string;
    proof: Hex[];
}

export interface BackendWhitelistedErc20Token extends UsdPricedErc20Token {
    minimumRate: string;
}

export interface BackendActivity {
    transaction: {
        hash: Hash;
        timestamp: string;
    };
    payload:
        | {
              type: "claim-reward";
              token: Erc20Token;
              amount: string;
              receiver: Address;
          }
        | {
              type: "create-campaign";
              id: Hash;
          };
}

export interface BackendLeaf {
    account: Address;
    tokenAddress: Address;
    amount: string;
}

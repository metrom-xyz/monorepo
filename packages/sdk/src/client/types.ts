import type { Address, Hash, Hex } from "viem";

export interface BackendErc20Token {
    address: Address;
    symbol: string;
    name: string;
    decimals: string;
}

export interface BackendReward extends BackendErc20Token {
    amount: string;
    remaining: string;
    usdPrice: string | null;
}

export interface BackendPool {
    address: Address;
    token0: BackendErc20Token;
    token1: BackendErc20Token;
    fee: string;
    tvl: string;
}

export interface BackendCampaignPool {
    amm: string;
    address: Address;
    token0: BackendErc20Token;
    token1: BackendErc20Token;
    fee: string;
    tvl: string | null;
}

export interface BackendCampaign {
    chainId: string;
    id: Hex;
    from: number;
    to: number;
    createdAt: number;
    snapshottedAt: number | null;
    pool: BackendCampaignPool;
    rewards: BackendReward[];
    whitelist: Address[] | null;
    blacklist: Address[] | null;
    apr: string | null;
}

export interface BackendClaim {
    chainId: string;
    campaignId: Hex;
    token: BackendErc20Token;
    amount: string;
    proof: Hex[];
}

export interface BackendWhitelistedToken extends BackendErc20Token {
    minimumRate: string;
    price: string;
}

export interface BackendActivity {
    transaction: {
        hash: Hash;
        timestamp: number;
    };
    payload:
        | {
              type: "claim-reward";
              token: BackendErc20Token;
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

export interface FetchCampaignsResponse {
    campaigns: BackendCampaign[];
}

export interface FetchPoolsResponse {
    pools: BackendPool[];
}

export interface FetchWhitelistedRewardTokensResponse {
    tokens: BackendWhitelistedToken[];
}

export interface FetchSnapshotResponse {
    timestamp: number;
    leaves: BackendLeaf[];
}

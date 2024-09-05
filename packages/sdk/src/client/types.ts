import type { Address } from "viem";

interface RawClaim {
    chainId: number;
    campaignId: Address;
    token: RawToken;
    amount: number;
    remaining: number;
    proof: Address[];
}

interface RawToken {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
}

interface RawWhitelistedToken extends RawToken {
    minimumRate: number;
    price: number | null;
}

interface RawPool {
    address: Address;
    amm: string;
    fee: number;
    tvl: number;
    token0: RawToken;
    token1: RawToken;
}

interface RawReward {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
    amount: number;
    remaining: number;
    usdPrice: number | null;
}

export interface RawCampaign {
    chainId: number;
    id: Address;
    from: number;
    to: number;
    createdAt: number;
    snapshottedAt: number | null;
    pool: RawPool;
    rewards: RawReward[];
    whitelist: Address[] | null;
    blacklist: Address[] | null;
    apr: number | null;
}

export interface FetchCampaignsResponse {
    campaigns: RawCampaign[];
    amount: number;
}

export interface FetchClaimsResponse {
    claims: RawClaim[];
}

export interface FetchPoolsResponse {
    pools: RawPool[];
}

export interface FetchWhitelistedRewardTokensResponse {
    tokens: RawWhitelistedToken[];
}

export interface RawLeaf {
    account: Address;
    tokenAddress: Address;
    amount: string;
}

export interface FetchSnapshotResponse {
    timestamp: number;
    leaves: RawLeaf[];
}

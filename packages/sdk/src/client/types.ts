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

export type FetchCampaignsResponse = {
    campaigns: RawCampaign[];
    amount: number;
};

export type FetchClaimsResponse = {
    claims: RawClaim[];
};

export type FetchPoolsResponse = {
    pools: RawPool[];
};

export type FetchWhitelistedRewardTokensResponse = {
    tokens: RawWhitelistedToken[];
};

export type FetchDistributionDataResponse = {
    account: Address;
    token_address: Address;
    amount: bigint;
}[];

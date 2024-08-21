import type { Address } from "viem";

interface RawClaimableRewards {
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
    minimumRate: string;
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
    amount: bigint;
    priceUsd: number | null;
}

type RawCampaign = {
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
};

export type FetchCampaignsResponse = {
    campaigns: RawCampaign[];
    amount: number;
};

export type FetchClaimsResponse = {
    claims: RawClaimableRewards[];
};

export type FetchPoolsResponse = {
    pools: RawPool[];
};

export type FetchWhitelistedRewardTokensResponse = {
    tokens: RawWhitelistedToken[];
};

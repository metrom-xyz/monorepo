import type { Address, Hex } from "viem";

type RawClaimableRewards = {
    campaignId: Address;
    token: RawToken;
    amount: string;
    remaining: string;
    proof: Address[];
};

type RawToken = {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
};

type RawWhitelistedToken = RawToken & { minimumRate: string };

type RawPool = {
    address: Address;
    amm: string;
    token0: RawToken;
    token1: RawToken;
};

type RawReward = {
    amount: string;
    claimed: string;
    recovered: string;
    remaining: string;
    token: RawToken;
    usdValue: number | null;
};

type RawCampaign = {
    id: Address;
    createdAt: number;
    owner: Address;
    pendingOwner: Address;
    from: number;
    to: number;
    pool: RawPool;
    specification: Hex;
    root: Hex;
    data: Hex;
    rewardsUsdValue: number | null;
    apr: number | null;
    rewards: RawReward[];
    whitelist: Address[] | null;
    blacklist: Address[] | null;
};

export type FetchCampaignsResponse = {
    campaigns: RawCampaign[];
    amount: number;
};

export type FetchClaimsResponse = {
    claims: RawClaimableRewards[];
};

export type FetchWhitelistedRewardTokensResponse = {
    tokens: RawWhitelistedToken[];
};

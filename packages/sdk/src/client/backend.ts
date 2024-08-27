import { type Address } from "viem";
import type {
    FetchCampaignsResponse,
    FetchClaimsResponse,
    FetchPoolsResponse,
    FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm } from "../commons";
import {
    Status,
    type Campaign,
    type Claim,
    type Pool,
    type Rewards,
    type WhitelistedErc20Token,
} from "../entities";

export interface FetchCampaignsParams {
    asc?: boolean;
}

export interface FetchPoolsParams {
    chainId: SupportedChain;
    amm: SupportedAmm;
}

export interface FetchClaimsParams {
    address: Address;
}

export interface FetchWhitelistedRewardTokensParams {
    chainId: SupportedChain;
}

export interface FetchWhitelistedRewardTokensResult {
    tokens: Address;
}

export class MetromApiClient {
    constructor(public readonly baseUrl: string) {}

    async fetchCampaigns(params?: FetchCampaignsParams): Promise<Campaign[]> {
        const url = new URL("campaigns", this.baseUrl);

        url.searchParams.set("asc", params?.asc ? "true" : "false");

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const rawCampaignsResponse =
            (await response.json()) as FetchCampaignsResponse;

        return rawCampaignsResponse.campaigns.map((rawCampaign) => {
            let status;
            const now = Math.floor(Date.now() / 1000);
            if (now < rawCampaign.from) {
                status = Status.Upcoming;
            } else if (now > rawCampaign.to) {
                status = Status.Ended;
            } else {
                status = Status.Live;
            }

            const rewards: Rewards = Object.assign([], { usdValue: 0 });
            for (const rawReward of rawCampaign.rewards) {
                let usdValue = null;
                if (rewards.usdValue !== null && rawReward.usdPrice) {
                    usdValue = rawReward.amount * rawReward.usdPrice;
                    rewards.usdValue += usdValue;
                }
                rewards.push({
                    ...rawReward,
                    usdValue,
                });
            }

            return {
                ...rawCampaign,
                status,
                pool: {
                    ...rawCampaign.pool,
                    chainId: rawCampaign.chainId,
                    amm: rawCampaign.pool.amm as SupportedAmm,
                },
                rewards,
            };
        });
    }

    async fetchPools(params: FetchPoolsParams): Promise<Pool[]> {
        const url = new URL("pools", this.baseUrl);

        url.searchParams.set("chainId", params.chainId.toString());
        url.searchParams.set("amm", params?.amm);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching pools: ${await response.text()}`,
            );

        const rawPoolsResponse = (await response.json()) as FetchPoolsResponse;

        return rawPoolsResponse.pools.map((pool) => ({
            ...pool,
            chainId: params.chainId,
            amm: pool.amm as SupportedAmm,
        }));
    }

    async fetchClaims(params: FetchClaimsParams): Promise<Claim[]> {
        const url = new URL("claims", this.baseUrl);

        url.searchParams.set("address", params.address);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching claimable rewards: ${await response.text()}`,
            );

        const { claims: rawClaims } =
            (await response.json()) as FetchClaimsResponse;

        return rawClaims;
    }

    async fetchWhitelistedRewardTokens(
        params: FetchWhitelistedRewardTokensParams,
    ): Promise<WhitelistedErc20Token[]> {
        const url = new URL("whitelisted-reward-tokens", this.baseUrl);

        url.searchParams.set("chainId", params.chainId.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching whitelisted reward tokens: ${await response.text()}`,
            );

        const rawWhitelistedTokens =
            (await response.json()) as FetchWhitelistedRewardTokensResponse;

        return rawWhitelistedTokens.tokens.map((token) => ({
            ...token,
            minimumRate: BigInt(token.minimumRate),
        }));
    }
}

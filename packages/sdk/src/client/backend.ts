import { type Address } from "viem";
import type {
    FetchCampaignsResponse,
    FetchClaimsResponse,
    FetchPoolsResponse,
    FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm } from "../commons";
import type {
    Campaign,
    Claim,
    Pool,
    Rewards,
    WhitelistedErc20Token,
} from "../entities";

export interface FetchCampaignsParams {
    pageNumber?: number;
    pageSize?: number;
    asc?: boolean;
}

export interface FetchCampaignsResult {
    campaigns: Campaign[];
    amount: bigint;
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

    async fetchCampaigns(
        params?: FetchCampaignsParams,
    ): Promise<FetchCampaignsResult> {
        const url = new URL("campaigns", this.baseUrl);

        url.searchParams.set(
            "pageNumber",
            (params?.pageNumber || 0).toString(),
        );
        url.searchParams.set("pageSize", (params?.pageSize || 10).toString());
        url.searchParams.set("asc", (params?.asc || false).toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const rawCampaignsResponse =
            (await response.json()) as FetchCampaignsResponse;

        return {
            campaigns: rawCampaignsResponse.campaigns.map((rawCampaign) => {
                const rewards: Rewards = Object.assign([], { valueUsd: 0 });
                for (const rawReward of rawCampaign.rewards) {
                    let valueUsd = null;
                    if (rewards.valueUsd !== null && rawReward.priceUsd) {
                        valueUsd =
                            Number(
                                (rawReward.amount / 10n) **
                                    BigInt(rawReward.decimals),
                            ) * rawReward.priceUsd;
                        rewards.valueUsd += valueUsd;
                    }
                    rewards.push({
                        ...rawReward,
                        valueUsd,
                    });
                }

                return {
                    ...rawCampaign,
                    pool: {
                        ...rawCampaign.pool,
                        amm: rawCampaign.pool.amm as SupportedAmm,
                    },
                    rewards,
                };
            }),
            amount: BigInt(rawCampaignsResponse.amount),
        };
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

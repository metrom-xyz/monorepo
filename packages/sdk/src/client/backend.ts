import { type Address } from "viem";
import type {
    FetchCampaignsResponse,
    FetchClaimsResponse,
    FetchPoolsResponse,
    FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_NAMES, SupportedAmm } from "../commons";
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
    amm: SupportedAmm;
}

export interface FetchClaimsParams {
    address: Address;
}

export interface FetchWhitelistedRewardTokensResult {
    tokens: Address;
}

export class MetromApiClient {
    private readonly chain: number;

    constructor(
        public readonly baseUrl: string,
        chain: SupportedChain,
    ) {
        if (!SUPPORTED_CHAIN_NAMES[chain])
            throw new Error(
                `unsupported chain, supported chains are: ${Object.keys(SUPPORTED_CHAIN_NAMES)}`,
            );

        this.chain = parseInt(chain as unknown as string);
    }

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

        url.searchParams.set("chainId", this.chain.toString());
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

        url.searchParams.set("chainId", this.chain.toString());
        url.searchParams.set("address", params.address);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching claimable rewards: ${await response.text()}`,
            );

        const { claims: rawClaims } =
            (await response.json()) as FetchClaimsResponse;

        return rawClaims.map((rawClaim) => ({
            ...rawClaim,
            token: {
                ...rawClaim.token,
                chainId: this.chain,
            },
        }));
    }

    async fetchWhitelistedRewardTokens(): Promise<WhitelistedErc20Token[]> {
        const url = new URL("whitelisted-reward-tokens", this.baseUrl);

        url.searchParams.set("chainId", this.chain.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching whitelisted reward tokens: ${await response.text()}`,
            );

        const rawWhitelistedTokens =
            (await response.json()) as FetchWhitelistedRewardTokensResponse;

        return rawWhitelistedTokens.tokens.map((token) => ({
            ...token,
            chainId: this.chain,
            minimumRate: BigInt(token.minimumRate),
        }));
    }
}

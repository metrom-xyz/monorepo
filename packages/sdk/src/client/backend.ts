import { formatUnits, type Address, type Hex } from "viem";
import {
    type BackendActivity,
    type BackendCampaign,
    type BackendClaim,
    type BackendErc20Token,
    type FetchCampaignsResponse,
    type FetchPoolsResponse,
    type FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm } from "../commons";
import {
    Status,
    type Activity,
    type Campaign,
    type Claim,
    type Erc20Token,
    type Pool,
    type Rewards,
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
} from "../types";

export interface FetchCampaignParams {
    chainId: number;
    id: Hex;
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

export interface FetchActivitiesParams {
    chainId: number;
    address: Address;
    from: number;
    to: number;
}

export interface FetchWhitelistedRewardTokensResult {
    tokens: Address;
}

export class MetromApiClient {
    constructor(public readonly baseUrl: string) {}

    async fetchCampaigns(): Promise<Campaign[]> {
        const response = await fetch(new URL("campaigns", this.baseUrl));
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const backendCampaigns =
            (await response.json()) as FetchCampaignsResponse;

        return backendCampaigns.campaigns.map(processCampaign);
    }

    async fetchCampaign(params: FetchCampaignParams): Promise<Campaign> {
        const url = new URL("campaign", this.baseUrl);

        url.searchParams.set("chainId", params.chainId.toString());
        url.searchParams.set("id", params.id.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaign with id ${params.id} on chain id ${params.chainId}: ${await response.text()}`,
            );

        return processCampaign((await response.json()) as BackendCampaign);
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

        const backendPools = (await response.json()) as FetchPoolsResponse;

        return backendPools.pools.map((pool) => ({
            chainId: Number(params.chainId),
            address: pool.address,
            amm: params.amm,
            fee: Number(pool.fee),
            token0: processErc20Token(pool.token0),
            token1: processErc20Token(pool.token1),
            tvl: toNumberOrNull(pool.tvl),
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

        const claims = (await response.json()) as BackendClaim[];

        return claims.map((claim) => {
            const token = processErc20Token(claim.token);
            const rawAmount = BigInt(claim.amount);

            return {
                chainId: Number(claim.chainId),
                campaignId: claim.campaignId,
                token,
                amount: {
                    raw: rawAmount,
                    formatted: Number(formatUnits(rawAmount, token.decimals)),
                },
                proof: claim.proof,
            };
        });
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

        const whitelistedTokens =
            (await response.json()) as FetchWhitelistedRewardTokensResponse;

        return whitelistedTokens.tokens.map((token) => {
            const processedToken = processErc20Token(token);
            const rawMinimumRate = BigInt(token.minimumRate);

            return {
                ...processedToken,
                minimumRate: {
                    raw: rawMinimumRate,
                    formatted: Number(
                        formatUnits(rawMinimumRate, processedToken.decimals),
                    ),
                },
                usdPrice: Number(token.price),
            };
        });
    }

    async fetchActivities(params: FetchActivitiesParams): Promise<Activity[]> {
        const url = new URL("activities", this.baseUrl);

        url.searchParams.set("chainId", params.chainId.toString());
        url.searchParams.set("address", params.address.toString());
        url.searchParams.set("from", params.from.toString());
        url.searchParams.set("to", params.to.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching activity for address ${params.address} from ${params.from} to ${params.to}: ${await response.text()}`,
            );

        const activities = (await response.json()) as BackendActivity[];

        return activities.map((activity) => {
            if (activity.payload.type === "claim-reward") {
                const processedToken = processErc20Token(
                    activity.payload.token,
                );
                const rawAmount = BigInt(activity.payload.amount);

                return {
                    ...activity,
                    payload: {
                        ...activity.payload,
                        token: processedToken,
                        amount: {
                            raw: rawAmount,
                            formatted: Number(
                                formatUnits(rawAmount, processedToken.decimals),
                            ),
                        },
                    },
                };
            }

            return activity as Activity;
        });
    }
}

function toNumberOrNull(maybeNumber: string | bigint | null): number | null {
    return maybeNumber ? Number(maybeNumber) : null;
}

function processCampaign(backendCampaign: BackendCampaign): Campaign {
    let status;
    const now = Math.floor(Date.now() / 1000);
    if (now < backendCampaign.from) {
        status = Status.Upcoming;
    } else if (now > backendCampaign.to) {
        status = Status.Ended;
    } else {
        status = Status.Live;
    }

    const rewards: Rewards = Object.assign([], {
        amountUsdValue: 0,
        remainingUsdValue: 0,
    });
    for (const backendReward of backendCampaign.rewards) {
        const decimals = Number(backendReward.decimals);

        const rawAmount = BigInt(backendReward.amount);
        const amount: UsdPricedOnChainAmount = {
            raw: rawAmount,
            formatted: Number(formatUnits(rawAmount, decimals)),
            usdValue: null,
        };

        const rawRemaining = BigInt(backendReward.remaining);
        const remaining: UsdPricedOnChainAmount = {
            raw: rawRemaining,
            formatted: Number(formatUnits(rawRemaining, decimals)),
            usdValue: null,
        };

        if (
            rewards.amountUsdValue !== null &&
            rewards.remainingUsdValue !== null &&
            backendReward.usdPrice
        ) {
            const usdPrice = Number(backendReward.usdPrice);

            amount.usdValue = amount.formatted * usdPrice;
            remaining.usdValue = remaining.formatted * usdPrice;

            rewards.amountUsdValue += amount.usdValue;
            rewards.remainingUsdValue += remaining.usdValue;
        } else {
            rewards.amountUsdValue = null;
            rewards.remainingUsdValue = null;
        }

        rewards.push({
            token: {
                ...processErc20Token(backendReward),
                usdPrice: toNumberOrNull(backendReward.usdPrice),
            },
            amount,
            remaining,
        });
    }

    const { specification, ...rest } = backendCampaign;

    const campaign: Campaign = {
        ...rest,
        chainId: Number(backendCampaign.chainId),
        status,
        pool: {
            ...backendCampaign.pool,
            // FIXME: we should return the pool chain id from the backend
            chainId: Number(backendCampaign.chainId),
            amm: backendCampaign.pool.amm as SupportedAmm,
            fee: toNumberOrNull(backendCampaign.pool.fee),
            tvl: toNumberOrNull(backendCampaign.pool.tvl),
            token0: processErc20Token(backendCampaign.pool.token0),
            token1: processErc20Token(backendCampaign.pool.token1),
        },
        apr: toNumberOrNull(backendCampaign.apr),
        rewards,
        whitelist: null,
        blacklist: null,
        kpi: null,
    };

    if (specification) {
        campaign.blacklist = specification.blacklist ?? campaign.blacklist;
        campaign.whitelist = specification.whitelist ?? campaign.whitelist;
        campaign.kpi = specification.kpi ?? campaign.kpi;
    }

    return campaign;
}

function processErc20Token(backendErc20Token: BackendErc20Token): Erc20Token {
    return {
        ...backendErc20Token,
        decimals: Number(backendErc20Token.decimals),
    };
}

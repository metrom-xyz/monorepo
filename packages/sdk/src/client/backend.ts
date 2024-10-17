import { formatUnits, type Address, type Hex } from "viem";
import {
    type BackendActivity,
    type BackendCampaign,
    type BackendClaim,
    type BackendPool,
    type BackendWhitelistedErc20Token,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm } from "../commons";
import {
    Status,
    type Activity,
    type Campaign,
    type Claim,
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
        const response = await fetch(new URL("v1/campaigns", this.baseUrl));
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const backendCampaigns = (await response.json()) as BackendCampaign[];

        return backendCampaigns.map(processCampaign);
    }

    async fetchCampaign(params: FetchCampaignParams): Promise<Campaign> {
        const response = await fetch(
            new URL(
                `v1/campaigns/${params.chainId}/${params.id}`,
                this.baseUrl,
            ),
        );
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaign with id ${params.id} on chain id ${params.chainId}: ${await response.text()}`,
            );

        return processCampaign((await response.json()) as BackendCampaign);
    }

    async fetchPools(params: FetchPoolsParams): Promise<Pool[]> {
        const url = new URL(
            `v1/pools/${params.chainId}/${params.amm}`,
            this.baseUrl,
        );

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching pools: ${await response.text()}`,
            );

        const backendPools = (await response.json()) as BackendPool[];

        return backendPools.map((pool) => ({
            ...pool,
            chainId: params.chainId,
        }));
    }

    async fetchClaims(params: FetchClaimsParams): Promise<Claim[]> {
        const url = new URL(`v1/claims/${params.address}`, this.baseUrl);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching claimable rewards: ${await response.text()}`,
            );

        const claims = (await response.json()) as BackendClaim[];

        return claims.map((claim) => {
            const rawAmount = BigInt(claim.amount);

            return {
                ...claim,
                amount: {
                    raw: rawAmount,
                    formatted: Number(
                        formatUnits(rawAmount, claim.token.decimals),
                    ),
                },
            };
        });
    }

    async fetchWhitelistedRewardTokens(
        params: FetchWhitelistedRewardTokensParams,
    ): Promise<WhitelistedErc20Token[]> {
        const url = new URL(`v1/reward-tokens/${params.chainId}`, this.baseUrl);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching whitelisted reward tokens: ${await response.text()}`,
            );

        const whitelistedTokens =
            (await response.json()) as BackendWhitelistedErc20Token[];

        return whitelistedTokens.map((token) => {
            const rawMinimumRate = BigInt(token.minimumRate);

            return {
                ...token,
                minimumRate: {
                    raw: rawMinimumRate,
                    formatted: Number(
                        formatUnits(rawMinimumRate, token.decimals),
                    ),
                },
            };
        });
    }

    async fetchActivities(params: FetchActivitiesParams): Promise<Activity[]> {
        const url = new URL(
            `v1/activities/${params.chainId}/${params.address}`,
            this.baseUrl,
        );

        url.searchParams.set("from", params.from.toString());
        url.searchParams.set("to", params.to.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching activity for address ${params.address} from ${params.from} to ${params.to}: ${await response.text()}`,
            );

        const activities = (await response.json()) as BackendActivity[];

        return activities.map((activity) => {
            const transaction = {
                ...activity.transaction,
                timestamp: new Date(activity.transaction.timestamp),
            };

            if (activity.payload.type === "claim-reward") {
                const rawAmount = BigInt(activity.payload.amount);
                return {
                    transaction,
                    payload: {
                        ...activity.payload,
                        amount: {
                            raw: rawAmount,
                            formatted: Number(
                                formatUnits(
                                    rawAmount,
                                    activity.payload.token.decimals,
                                ),
                            ),
                        },
                    },
                };
            } else {
                return { ...activity, transaction } as Activity;
            }
        });
    }
}

function processCampaign(backendCampaign: BackendCampaign): Campaign {
    const from = new Date(backendCampaign.from);
    const to = new Date(backendCampaign.to);

    let status;
    const now = new Date();
    if (now < from) {
        status = Status.Upcoming;
    } else if (now > to) {
        status = Status.Ended;
    } else {
        status = Status.Live;
    }

    const rewards: Rewards = Object.assign([], {
        amountUsdValue: 0,
        remainingUsdValue: 0,
    });
    for (const backendReward of backendCampaign.rewards) {
        const rawAmount = BigInt(backendReward.amount);
        const amount: UsdPricedOnChainAmount = {
            raw: rawAmount,
            formatted: Number(formatUnits(rawAmount, backendReward.decimals)),
            usdValue: null,
        };

        const rawRemaining = BigInt(backendReward.remaining);
        const remaining: UsdPricedOnChainAmount = {
            raw: rawRemaining,
            formatted: Number(
                formatUnits(rawRemaining, backendReward.decimals),
            ),
            usdValue: null,
        };

        amount.usdValue = amount.formatted * backendReward.usdPrice;
        remaining.usdValue = remaining.formatted * backendReward.usdPrice;

        if (
            rewards.amountUsdValue !== null &&
            rewards.remainingUsdValue !== null
        ) {
            rewards.amountUsdValue += amount.usdValue;
            rewards.remainingUsdValue += remaining.usdValue;
        }

        rewards.push({
            token: backendReward,
            amount,
            remaining,
        });
    }

    const campaign: Campaign = {
        ...backendCampaign,
        from,
        to,
        createdAt: new Date(backendCampaign.createdAt),
        snapshottedAt: backendCampaign.snapshottedAt
            ? new Date(backendCampaign.snapshottedAt)
            : null,
        status,
        pool: {
            chainId: backendCampaign.chainId,
            ...backendCampaign.pool,
        },
        rewards,
    };

    return campaign;
}

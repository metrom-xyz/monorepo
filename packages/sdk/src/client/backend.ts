import { formatUnits, type Address, type Hex } from "viem";
import {
    type BackendActivity,
    type BackendCampaign,
    type BackendClaim,
    type BackendPool,
    type BackendWhitelistedErc20Token,
    type BackendReimbursement,
    type BackendKpiMeasurement,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedDex } from "../commons";
import {
    Status,
    type Activity,
    type Campaign,
    type Claim,
    type KpiMeasurement,
    type Pool,
    type Reimbursement,
    type Rewards,
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
} from "../types";

const BI_1_000_000 = BigInt(1_000_000);

export interface FetchCampaignParams {
    chainId: number;
    id: Hex;
}

export interface FetchPoolsParams {
    chainId: SupportedChain;
    dex: SupportedDex;
}

export interface FetchClaimsParams {
    address: Address;
}

export interface FetchReimbursementsParams {
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

export interface FetchKpiMeasurementsResult {
    campaign: Campaign;
    from: number;
    to: number;
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
            `v1/pools/${params.chainId}/${params.dex}`,
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

    async fetchReimbursements(
        params: FetchReimbursementsParams,
    ): Promise<Reimbursement[]> {
        const url = new URL(
            `v1/reimbursements/${params.address}`,
            this.baseUrl,
        );

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching reimbursements: ${await response.text()}`,
            );

        const reimbursements =
            (await response.json()) as BackendReimbursement[];

        return reimbursements.map((reimbursement) => {
            const rawAmount = BigInt(reimbursement.amount);

            return {
                ...reimbursement,
                amount: {
                    raw: rawAmount,
                    formatted: Number(
                        formatUnits(rawAmount, reimbursement.token.decimals),
                    ),
                },
                proof: reimbursement.proof,
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
            if (activity.payload.type === "claim-reward") {
                const rawAmount = BigInt(activity.payload.amount);
                return {
                    ...activity,
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
                return activity as Activity;
            }
        });
    }

    async fetchKpiMeasurements(
        params: FetchKpiMeasurementsResult,
    ): Promise<KpiMeasurement[]> {
        if (
            !params.campaign.specification ||
            !params.campaign.specification.kpi
        )
            throw new Error(
                `Tried to fetch KPI measurements for campaign with id ${params.campaign.id} in chain with id ${params.campaign.chainId} with no attached KPI`,
            );

        const url = new URL(
            `v1/kpi-measurements/${params.campaign.chainId}/${params.campaign.id}`,
            this.baseUrl,
        );

        url.searchParams.set("from", params.from.toString());
        url.searchParams.set("to", params.to.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching kpi measurements for campaign with id ${params.campaign.id} in chain with id ${params.campaign.chainId} from ${params.from} to ${params.to}: ${await response.text()}`,
            );

        const measurements = (await response.json()) as BackendKpiMeasurement[];

        const totalCampaignDuration = params.campaign.to - params.campaign.from;
        return measurements.map((measurement) => {
            const measuredPeriodDuration = measurement.to - measurement.from;
            const periodDurationMultiplier = {
                standard: measuredPeriodDuration / totalCampaignDuration,
                get scaled() {
                    return BigInt(Math.floor(this.standard * 1_000_000));
                },
            };

            const distributions = params.campaign.rewards.map((reward) => {
                const boundPercentage = {
                    standard: Math.min(Math.max(measurement.percentage, 0), 1),
                    get scaled() {
                        return BigInt(Math.floor(this.standard * 1_000_000));
                    },
                };

                const totalDistributedInPeriodFormatted =
                    reward.amount.formatted * periodDurationMultiplier.standard;
                const totalDistributedInPeriodRaw =
                    (reward.amount.raw * periodDurationMultiplier.scaled) /
                    BI_1_000_000;

                const distributedToLpsInPeriodFormatted =
                    totalDistributedInPeriodFormatted *
                    boundPercentage.standard;

                const distributedToLpsInPeriodRaw =
                    (totalDistributedInPeriodRaw * boundPercentage.scaled) /
                    BI_1_000_000;

                const distributedInPeriod: UsdPricedOnChainAmount = {
                    raw: distributedToLpsInPeriodRaw,
                    formatted: distributedToLpsInPeriodFormatted,
                    usdValue:
                        distributedToLpsInPeriodFormatted *
                        reward.token.usdPrice,
                };

                const reimbursedInPeriodFormatted =
                    totalDistributedInPeriodFormatted -
                    distributedToLpsInPeriodFormatted;
                const reimbursedInPeriod: UsdPricedOnChainAmount = {
                    raw:
                        totalDistributedInPeriodRaw -
                        distributedToLpsInPeriodRaw,
                    formatted: reimbursedInPeriodFormatted,
                    usdValue:
                        reimbursedInPeriodFormatted * reward.token.usdPrice,
                };

                return {
                    token: reward.token,
                    distributed: distributedInPeriod,
                    reimbursed: reimbursedInPeriod,
                };
            });

            const goalLowerTarget =
                params.campaign.specification!.kpi!.goal.lowerUsdTarget;
            const goalUpperTarget =
                params.campaign.specification!.kpi!.goal.upperUsdTarget;
            const goalRange = goalUpperTarget - goalLowerTarget;

            return {
                from: measurement.from,
                to: measurement.to,
                percentage: measurement.percentage,
                value: goalLowerTarget + goalRange * measurement.percentage,
                distributions,
            };
        });
    }
}

function processCampaign(backendCampaign: BackendCampaign): Campaign {
    const from = Number(backendCampaign.from);
    const to = Number(backendCampaign.to);

    let status;
    const now = Number(Math.floor(Date.now() / 1000));
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
        createdAt: Number(backendCampaign.createdAt),
        snapshottedAt: backendCampaign.snapshottedAt
            ? Number(backendCampaign.snapshottedAt)
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

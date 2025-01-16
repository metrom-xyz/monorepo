import { formatUnits, type Address, type Hex } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm, SupportedDex } from "../commons";
import type {
    BackendCampaignResponse,
    BackendCampaignsResponse,
    BackendLiquityV2DebtBrand,
} from "./types/campaigns";
import type {
    BackendAmmPool,
    BackendErc20Token,
    BackendUsdPricedErc20Token,
} from "./types/commons";
import {
    type AmmPoolLiquidityTarget,
    Campaign,
    type LiquityV2DebtBrand,
    type LiquityV2DebtTarget,
    type PointDistributables,
    type TokenDistributable,
    type TokenDistributables,
} from "../types/campaigns";
import type {
    AmmPool,
    Erc20Token,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "../types/commons";
import type { BackendPoolsResponse } from "./types/pools";
import type { Claim, Reimbursement } from "../types/claims";
import type {
    BackendClaimsResponse,
    BackendReimbursementsResponse,
} from "./types/claims";
import type { RewardToken } from "../types/reward-tokens";
import type { BackendRewardTokensResponse } from "./types/reward-tokens";
import type { Activity } from "../types/activities";
import type { BackendActivitiesResponse } from "./types/activities";
import type { KpiMeasurement } from "../types/kpi-measurements";
import type { BackendKpiMeasurementResponse } from "./types/kpi-measurements";
import type {
    Leaderboard,
    PointsLeaderboardRank,
    TokensLeaderboardRank,
} from "../types/leaderboards";
import type { BackendLeaderboardResponse } from "./types/leaderboards";
import type { FeeToken } from "src/types/fee-tokens";

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

export interface FetchWhitelistedTokensParams {
    chainId: SupportedChain;
}

export interface FetchActivitiesParams {
    chainId: number;
    address: Address;
    from: number;
    to: number;
}

export interface FetchWhitelistedRewardTokensParams {
    tokens: Address;
}

export interface FetchKpiMeasurementsParams {
    campaign: Campaign;
    from: number;
    to: number;
}

export interface FetchLeaderboardParams {
    campaign: Campaign;
    account?: Address;
}

export class MetromApiClient {
    constructor(public readonly baseUrl: string) {}

    async fetchCampaigns(): Promise<Campaign[]> {
        const response = await fetch(new URL("v1/campaigns", this.baseUrl));
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const parsedResponse =
            (await response.json()) as BackendCampaignsResponse;

        return processCampaignsResponse(parsedResponse);
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

        const parsedResponse =
            (await response.json()) as BackendCampaignResponse;

        const processedCampaigns = processCampaignsResponse({
            ...parsedResponse,
            campaigns: [parsedResponse.campaign],
        });

        if (processedCampaigns.length != 1)
            throw new Error(
                `Inconsistent campaigns response processing length ${processedCampaigns.length}: 1 expected`,
            );

        return processedCampaigns[0];
    }

    async fetchAmmPools(params: FetchPoolsParams): Promise<AmmPool[]> {
        const url = new URL(
            `v1/pools/${params.chainId}/${params.dex}`,
            this.baseUrl,
        );

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching pools: ${await response.text()}`,
            );

        const parsedResponse = (await response.json()) as BackendPoolsResponse;

        return parsedResponse.ammPools.map((ammPool) => {
            return {
                ...ammPool,
                dex: ammPool.dex as SupportedDex,
                amm: ammPool.amm as SupportedAmm,
                tokens: ammPool.tokens.map((address) =>
                    resolveToken(parsedResponse.resolvedTokens, address),
                ),
            };
        });
    }

    async fetchClaims(params: FetchClaimsParams): Promise<Claim[]> {
        const url = new URL(`v1/claims/${params.address}`, this.baseUrl);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching claimable rewards: ${await response.text()}`,
            );

        const parsedResponse = (await response.json()) as BackendClaimsResponse;

        return parsedResponse.claims.map((claim) => {
            const resolvedToken = resolvePricedTokenInChain(
                parsedResponse.resolvedPricedTokens,
                claim.chainId,
                claim.token,
            );

            return {
                ...claim,
                token: resolvedToken,
                amount: stringToUsdPricedOnChainAmount(
                    claim.amount,
                    resolvedToken.decimals,
                    resolvedToken.usdPrice,
                ),
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

        const parsedResponse =
            (await response.json()) as BackendReimbursementsResponse;

        return parsedResponse.reimbursements.map((reimbursement) => {
            const resolvedToken = resolvePricedTokenInChain(
                parsedResponse.resolvedPricedTokens,
                reimbursement.chainId,
                reimbursement.token,
            );

            return {
                ...reimbursement,
                token: resolvedToken,
                amount: stringToUsdPricedOnChainAmount(
                    reimbursement.amount,
                    resolvedToken.decimals,
                    resolvedToken.usdPrice,
                ),
            };
        });
    }

    async fetchRewardTokens(
        params: FetchWhitelistedTokensParams,
    ): Promise<RewardToken[]> {
        const response = await fetch(
            new URL(`v1/reward-tokens/${params.chainId}`, this.baseUrl),
        );
        if (!response.ok)
            throw new Error(
                `response not ok while fetching reward tokens: ${await response.text()}`,
            );

        const parsedResponse =
            (await response.json()) as BackendRewardTokensResponse;

        return parsedResponse.tokens.map((token) => {
            return {
                ...token,
                minimumRate: stringToOnChainAmount(
                    token.minimumRate,
                    token.decimals,
                ),
            };
        });
    }

    async fetchFeeTokens(
        params: FetchWhitelistedTokensParams,
    ): Promise<FeeToken[]> {
        const response = await fetch(
            new URL(`v1/fee-tokens/${params.chainId}`, this.baseUrl),
        );
        if (!response.ok)
            throw new Error(
                `response not ok while fetching reward tokens: ${await response.text()}`,
            );

        const parsedResponse =
            (await response.json()) as BackendRewardTokensResponse;

        return parsedResponse.tokens.map((token) => {
            return {
                ...token,
                minimumRate: stringToOnChainAmount(
                    token.minimumRate,
                    token.decimals,
                ),
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

        const parsedResponse =
            (await response.json()) as BackendActivitiesResponse;

        return parsedResponse.activities.map((activity) => {
            switch (activity.payload.type) {
                case "claim-reward": {
                    const resolvedToken = resolveToken(
                        parsedResponse.resolvedTokens,
                        activity.payload.token,
                    );

                    return {
                        ...activity,
                        payload: {
                            ...activity.payload,
                            token: resolvedToken,
                            amount: stringToOnChainAmount(
                                activity.payload.amount,
                                resolvedToken.decimals,
                            ),
                        },
                    };
                }
                case "create-campaign":
                    return activity as Activity;
            }
        });
    }

    async fetchKpiMeasurements(
        params: FetchKpiMeasurementsParams,
    ): Promise<KpiMeasurement[]> {
        if (
            !params.campaign.specification ||
            !params.campaign.specification.kpi
        )
            throw new Error(
                `Tried to fetch KPI measurements for campaign with id ${params.campaign.id} in chain with id ${params.campaign.chainId} with no attached KPI`,
            );

        if (params.campaign.distributables.type != "tokens")
            throw new Error(
                `Tried to fetch KPI measurements for ampaign with id ${params.campaign.id} in chain with id ${params.campaign.chainId} not distributing tokens`,
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

        const parsedResponse =
            (await response.json()) as BackendKpiMeasurementResponse;

        const minimumPayoutPercentage =
            params.campaign.specification!.kpi!.minimumPayoutPercentage || 0;

        const totalCampaignDuration = params.campaign.to - params.campaign.from;
        return parsedResponse.measurements.map((measurement) => {
            const measuredPeriodDuration = Math.min(
                measurement.to - measurement.from,
                params.campaign.to - params.campaign.from,
            );
            const periodDurationMultiplier = {
                standard: measuredPeriodDuration / totalCampaignDuration,
                get scaled() {
                    return BigInt(Math.floor(this.standard * 1_000_000));
                },
            };

            const distributions = (
                params.campaign.distributables as TokenDistributables
            ).list.map((distributable) => {
                const normalizedKpiMeasurementPercentage = Math.min(
                    Math.max(measurement.percentage, 0),
                    1,
                );
                const boundPercentage = {
                    standard:
                        minimumPayoutPercentage +
                        (1 - minimumPayoutPercentage) *
                            normalizedKpiMeasurementPercentage,
                    get scaled() {
                        return BigInt(Math.floor(this.standard * 1_000_000));
                    },
                };

                const totalDistributedInPeriodFormatted =
                    distributable.amount.formatted *
                    periodDurationMultiplier.standard;
                const totalDistributedInPeriodRaw =
                    (distributable.amount.raw *
                        periodDurationMultiplier.scaled) /
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
                        distributable.token.usdPrice,
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
                        reimbursedInPeriodFormatted *
                        distributable.token.usdPrice,
                };

                return {
                    token: distributable.token,
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

    async fetchLeaderboard(
        params: FetchLeaderboardParams,
    ): Promise<Leaderboard | null> {
        const url = new URL(
            `v1/leaderboards/${params.campaign.chainId}/${params.campaign.id}`,
            this.baseUrl,
        );

        if (params.account)
            url.searchParams.set("account", params.account.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching leaderboard for campaign with id ${params.campaign.id} in chain with id ${params.campaign.chainId}: ${await response.text()}`,
            );

        const { resolvedPricedTokens, updatedAt, leaderboard } =
            (await response.json()) as BackendLeaderboardResponse;

        if (!updatedAt || !leaderboard || leaderboard.ranks.length === 0) {
            return null;
        }

        switch (leaderboard.type) {
            case "tokens": {
                return {
                    updatedAt,
                    leaderboard: {
                        type: "tokens",
                        ranks: leaderboard.ranks.map((rank) => {
                            return <TokensLeaderboardRank>{
                                ...rank,
                                weight: rank.weight * 100,
                                distributed: rank.distributed.map(
                                    (distributed) => {
                                        return {
                                            amount: stringToOnChainAmount(
                                                distributed.amount,
                                                18,
                                            ),
                                            token: resolvePricedToken(
                                                resolvedPricedTokens,
                                                distributed.address,
                                            ),
                                        };
                                    },
                                ),
                            };
                        }),
                    },
                };
            }
            case "points": {
                return {
                    updatedAt,
                    leaderboard: {
                        type: "points",
                        ranks: leaderboard.ranks.map((rank) => {
                            return <PointsLeaderboardRank>{
                                ...rank,
                                weight: rank.weight * 100,
                                distributed: stringToOnChainAmount(
                                    rank.distributed,
                                    18,
                                ),
                            };
                        }),
                    },
                };
            }
        }
    }
}

function processCampaignsResponse(
    response: BackendCampaignsResponse,
): Campaign[] {
    const campaigns = [];

    for (const backendCampaign of response.campaigns) {
        let target;
        switch (backendCampaign.target.type) {
            case "amm-pool-liquidity": {
                target = <AmmPoolLiquidityTarget>{
                    ...backendCampaign.target,
                    pool: resolveAmmPool(
                        response.resolvedAmmPools,
                        response.resolvedTokens,
                        backendCampaign.target.chainId,
                        backendCampaign.target.poolAddress,
                    ),
                };
                break;
            }
            case "liquity-v2-debt": {
                target = <LiquityV2DebtTarget>{
                    ...backendCampaign.target,
                    liquityV2Brand: resolveLiquityV2DebtBrand(
                        response.resolvedLiquityV2Debts,
                        backendCampaign.target.chainId,
                        backendCampaign.target.liquityV2Brand,
                    ),
                };
                break;
            }
        }

        let distributables;
        switch (backendCampaign.distributables.type) {
            case "tokens": {
                distributables = <TokenDistributables>{
                    type: "tokens",
                    list: [],
                    amountUsdValue: 0,
                    remainingUsdValue: 0,
                };

                for (const backendReward of backendCampaign.distributables
                    .list) {
                    const resolvedToken = resolvePricedTokenInChain(
                        response.resolvedPricedTokens,
                        backendCampaign.chainId,
                        backendReward.token,
                    );

                    const amount = stringToUsdPricedOnChainAmount(
                        backendReward.amount,
                        resolvedToken.decimals,
                        resolvedToken.usdPrice,
                    );
                    const remaining = stringToUsdPricedOnChainAmount(
                        backendReward.remaining,
                        resolvedToken.decimals,
                        resolvedToken.usdPrice,
                    );

                    distributables.amountUsdValue += amount.usdValue;
                    distributables.remainingUsdValue += remaining.usdValue;

                    distributables.list.push(<TokenDistributable>{
                        amount,
                        remaining,
                        token: resolvedToken,
                    });
                }
                break;
            }
            case "points": {
                distributables = <PointDistributables>{
                    type: "points",
                    amount: stringToOnChainAmount(
                        backendCampaign.distributables.amount,
                        18,
                    ),
                };
                break;
            }
        }

        campaigns.push(
            new Campaign(
                backendCampaign.chainId,
                backendCampaign.id,
                backendCampaign.from,
                backendCampaign.to,
                backendCampaign.createdAt,
                target,
                distributables,
                backendCampaign.snapshottedAt,
                backendCampaign.specification,
                backendCampaign.apr,
            ),
        );
    }

    return campaigns;
}

function resolveAmmPool(
    poolsRegistry: Record<number, Record<Address, BackendAmmPool>>,
    tokensRegistry: Record<number, Record<Address, BackendErc20Token>>,
    chainId: number,
    address: Address,
): AmmPool {
    const resolvedPool = poolsRegistry[chainId][address];
    if (!resolvedPool)
        throw new Error(
            `Could not find resolved pool with address ${address} in chain with id ${chainId}`,
        );

    return {
        ...resolvedPool,
        address,
        dex: resolvedPool.dex as SupportedDex,
        amm: resolvedPool.amm as SupportedAmm,
        tokens: resolvedPool.tokens.map((address) =>
            resolveTokenInChain(tokensRegistry, chainId, address),
        ),
    };
}

function resolveLiquityV2DebtBrand(
    liquityV2DebtBrandsRegistry: Record<
        number,
        Record<string, BackendLiquityV2DebtBrand>
    >,
    chainId: number,
    brand: string,
): LiquityV2DebtBrand {
    const resolved = liquityV2DebtBrandsRegistry[chainId][brand];
    if (!resolved)
        throw new Error(
            `Could not find resolved Liquity v2 debt brand with name ${brand} in chain with id ${chainId}`,
        );

    return {
        ...resolved,
        name: resolved.brand,
    };
}

function resolveTokenInChain(
    registry: Record<number, Record<Address, BackendErc20Token>>,
    chainId: number,
    address: Address,
): Erc20Token {
    const resolved = registry[chainId][address];
    if (!resolved)
        throw new Error(
            `Could not find resolved token with address ${address} in chain with id ${chainId}`,
        );

    return {
        ...resolved,
        address,
    };
}

function resolveToken(
    registry: Record<Address, BackendErc20Token>,
    address: Address,
): Erc20Token {
    const resolved = registry[address];
    if (!resolved)
        throw new Error(
            `Could not find resolved token with address ${address}`,
        );

    return {
        ...resolved,
        address,
    };
}

function resolvePricedTokenInChain(
    registry: Record<number, Record<Address, BackendUsdPricedErc20Token>>,
    chainId: number,
    address: Address,
): UsdPricedErc20Token {
    const resolved = registry[chainId][address];
    if (!resolved)
        throw new Error(
            `Could not find resolved priced token with address ${address} in chain with id ${chainId}`,
        );

    return {
        ...resolved,
        address,
    };
}

function resolvePricedToken(
    registry: Record<Address, BackendUsdPricedErc20Token>,
    address: Address,
): UsdPricedErc20Token {
    const resolved = registry[address];
    if (!resolved)
        throw new Error(
            `Could not find resolved priced token with address ${address}`,
        );

    return {
        ...resolved,
        address,
    };
}

function stringToOnChainAmount(value: string, decimals: number): OnChainAmount {
    const rawAmount = BigInt(value);
    const formattedAmount = Number(formatUnits(rawAmount, decimals));
    return {
        raw: rawAmount,
        formatted: formattedAmount,
    };
}

function stringToUsdPricedOnChainAmount(
    value: string,
    decimals: number,
    usdPrice: number,
): UsdPricedOnChainAmount {
    const { raw, formatted } = stringToOnChainAmount(value, decimals);
    return {
        raw,
        formatted,
        usdValue: formatted * usdPrice,
    };
}

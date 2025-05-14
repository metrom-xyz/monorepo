import { formatUnits, type Address, type Hex } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SupportedAmm, SupportedDex, SupportedLiquityV2 } from "../commons";
import type {
    BackendCampaignResponse,
    BackendCampaignsResponse,
    BackendCampaignStatus,
} from "./types/campaigns";
import type {
    BackendAmmPool,
    BackendErc20Token,
    BackendUsdPricedErc20Token,
} from "./types/commons";
import {
    type AmmPoolLiquidityTarget,
    Campaign,
    type LiquityV2DebtTarget,
    type LiquityV2StabilityPoolTarget,
    type PointDistributables,
    TargetType,
    type TokenDistributable,
    type TokenDistributables,
} from "../types/campaigns";
import type {
    AmmPool,
    AmmPoolWithTvl,
    Erc20Token,
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "../types/commons";
import type { BackendPoolResponse, BackendPoolsResponse } from "./types/pools";
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
import type { FeeToken } from "../types/fee-tokens";
import type {
    LiquidityDensity,
    LiquidityInRange,
    TickWithPrices,
} from "../types/initialized-ticks";
import type {
    BackendInitializedTicksResponse,
    BackendLiquidityInRangeResponse,
} from "./types/initialized-ticks";
import { tickToScaledPrice } from "../utils";
import type { BackendLiquityV2CollateralsResponse } from "./types/liquity-v2";
import type { LiquityV2Collateral } from "src/types/liquity-v2";

const MIN_TICK = -887272;
const MAX_TICK = -MIN_TICK;
const TICK_AVERAGE_FACTOR = 100;
const BI_1_000_000 = BigInt(1_000_000);

const DEX_BRAND_NAME: Record<SupportedDex, string> = {
    [SupportedDex.UniswapV3]: "Uniswap v3",
    [SupportedDex.TestIntegral]: "Test Integral",
    [SupportedDex.Swapsicle]: "Swapsicle",
    [SupportedDex.Kim]: "Kim",
    [SupportedDex.Panko]: "Panko",
    [SupportedDex.Scribe]: "Scribe",
    [SupportedDex.BaseSwap]: "BaseSwap",
    [SupportedDex.Fibonacci]: "Fibonacci",
    [SupportedDex.ThirdTrade]: "ThirdTrade",
    [SupportedDex.SilverSwap]: "SilverSwap",
    [SupportedDex.Swapr]: "Swapr",
    [SupportedDex.Unagi]: "Unagi",
    [SupportedDex.Carbon]: "Carbon",
    [SupportedDex.Velodrome]: "Velodrome",
};

const LIQUITY_V2_BRAND_NAME: Record<SupportedLiquityV2, string> = {
    [SupportedLiquityV2.Ebisu]: "Ebisu",
    [SupportedLiquityV2.Orki]: "Orki",
    [SupportedLiquityV2.Quill]: "Quill",
    [SupportedLiquityV2.Liquity]: "Liquity",
};

export interface FetchCampaignsParams {
    status?: BackendCampaignStatus;
    owner?: Address;
    chainId?: SupportedChain;
    dex?: SupportedDex;
}

export interface FetchCampaignParams {
    chainId: number;
    id: Hex;
}

export interface FetchPoolsParams {
    chainId: SupportedChain;
    dex: SupportedDex;
}

export interface FetchPoolParams {
    chainId: SupportedChain;
    id: Hex;
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
    chainId: SupportedChain;
    campaignId: Hex;
    account?: Address;
}

export interface FetchLiquidityInRangeParams {
    chainId: number;
    pool: AmmPool;
    from: number;
    to: number;
}

export interface FetchInitializedTicksParams {
    chainId: number;
    pool: AmmPool;
    surroundingAmount: number;
    computeAmount?: number;
}

export interface FetchLiquityV2CollateralsParams {
    chainId: number;
    brand: SupportedLiquityV2;
}

interface InitializedTick {
    idx: number;
    liquidityNet: bigint;
}

interface ProcessedTick {
    idx: number;
    liquidity: {
        net: bigint;
        active: bigint;
    };
    price0: number;
    price1: number;
}

enum Direction {
    Asc,
    Desc,
}

export class MetromApiClient {
    constructor(public readonly baseUrl: string) {}

    async fetchCampaigns(params?: FetchCampaignsParams): Promise<Campaign[]> {
        const url = new URL("v1/campaigns", this.baseUrl);

        if (params)
            for (const param in params) {
                url.searchParams.set(
                    param,
                    params[param as keyof FetchCampaignsParams]!.toString(),
                );
            }

        const response = await fetch(url);

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

    async fetchAmmPools(params: FetchPoolsParams): Promise<AmmPoolWithTvl[]> {
        const url = new URL(
            `v1/amm-pools/${params.chainId}/${params.dex}`,
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
                // FIXME: it's probably better to have this in the response
                chainId: params.chainId,
                dex: {
                    slug: ammPool.dex as SupportedDex,
                    name: DEX_BRAND_NAME[ammPool.dex as SupportedDex],
                },
                amm: ammPool.amm as SupportedAmm,
                tokens: ammPool.tokens.map((address) =>
                    resolveToken(parsedResponse.resolvedTokens, address),
                ),
            };
        });
    }

    async fetchPool(params: FetchPoolParams): Promise<AmmPoolWithTvl | null> {
        const url = new URL(
            `v1/amm-pools/${params.chainId}/${params.id}`,
            this.baseUrl,
        );

        const response = await fetch(url);
        if (response.status === 404) return null;

        if (!response.ok)
            throw new Error(
                `response not ok while fetching pools: ${await response.text()}`,
            );

        const parsedResponse = (await response.json()) as BackendPoolResponse;

        return {
            ...parsedResponse.ammPool,
            // FIXME: it's probably better to have this in the response
            chainId: params.chainId,
            dex: {
                slug: parsedResponse.ammPool.dex as SupportedDex,
                name: DEX_BRAND_NAME[
                    parsedResponse.ammPool.dex as SupportedDex
                ],
            },
            amm: parsedResponse.ammPool.amm as SupportedAmm,
            tokens: parsedResponse.ammPool.tokens.map((address) =>
                resolveToken(parsedResponse.resolvedTokens, address),
            ),
        };
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
            `v1/leaderboards/${params.chainId}/${params.campaignId}`,
            this.baseUrl,
        );

        if (params.account)
            url.searchParams.set("account", params.account.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching leaderboard for campaign with id ${params.campaignId} in chain with id ${params.chainId}: ${await response.text()}`,
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
                                        const resolvedToken =
                                            resolvePricedToken(
                                                resolvedPricedTokens,
                                                distributed.address,
                                            );

                                        return {
                                            amount: stringToUsdPricedOnChainAmount(
                                                distributed.amount,
                                                resolvedToken.decimals,
                                                resolvedToken.usdPrice,
                                            ),
                                            token: resolvedToken,
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

    async fetchLiquidityInRange(
        params: FetchLiquidityInRangeParams,
    ): Promise<LiquidityInRange> {
        const url = new URL(
            `v1/liquidities-in-range/${params.chainId}/${params.pool.id}`,
            this.baseUrl,
        );

        url.searchParams.set("from", params.from.toString());
        url.searchParams.set("to", params.to.toString());

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching liquidity in range ${params.from}-${params.to} for pool ${params.pool.id} in chain with id ${params.chainId}: ${await response.text()}`,
            );

        const { activeTick, liquidity } =
            (await response.json()) as BackendLiquidityInRangeResponse;

        return {
            activeTick: {
                ...activeTick,
                liquidity: BigInt(activeTick.liquidity),
            },
            liquidity: BigInt(liquidity),
        };
    }

    async fetchLiquidityDensity(
        params: FetchInitializedTicksParams,
    ): Promise<LiquidityDensity> {
        const url = new URL(
            `v1/initialized-ticks/${params.chainId}/${params.pool.id}`,
            this.baseUrl,
        );

        if (params.surroundingAmount)
            url.searchParams.set(
                "surroundingTicksAmount",
                params.surroundingAmount.toString(),
            );

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching ${params.surroundingAmount} surrounding initialized ticks for pool ${params.pool.id} in chain with id ${params.chainId}: ${await response.text()}`,
            );

        const { activeTick, ticks: initializedTicks } =
            (await response.json()) as BackendInitializedTicksResponse;

        const initializedTicksByIdx = initializedTicks.reduce(
            (acc: Record<number, InitializedTick>, tick) => {
                acc[tick.idx] = {
                    idx: tick.idx,
                    liquidityNet: BigInt(tick.liquidityNet),
                };
                return acc;
            },
            {},
        );

        const price0 = tickToScaledPrice(activeTick.idx, params.pool, true);
        const activeTickProcessed: ProcessedTick = {
            idx: activeTick.idx,
            liquidity: {
                active: BigInt(activeTick.liquidity),
                net: 0n,
            },
            price0,
            price1: 1 / price0,
        };

        // If our active tick happens to be initialized (i.e. there is a position that starts or
        // ends at that tick), ensure we set the net liquidity correctly.
        const initializedActiveTick = initializedTicksByIdx[activeTick.idx];
        if (initializedActiveTick) {
            activeTickProcessed.liquidity.net =
                initializedActiveTick.liquidityNet;
        }

        const subsequentTicks = computeSurroundingTicks(
            initializedTicksByIdx,
            activeTickProcessed,
            params.pool,
            params.computeAmount,
            Direction.Asc,
        );

        const previousTicks = computeSurroundingTicks(
            initializedTicksByIdx,
            activeTickProcessed,
            params.pool,
            params.computeAmount,
            Direction.Desc,
        );

        const ticks = averageTicks(
            previousTicks
                .concat({
                    idx: activeTickProcessed.idx,
                    liquidity: activeTickProcessed.liquidity.active,
                    price0: activeTickProcessed.price0,
                    price1: activeTickProcessed.price1,
                })
                .concat(subsequentTicks),
        );

        return {
            activeIdx: activeTick.idx,
            ticks,
        };
    }

    async fetchLiquityV2Collaterals(
        params: FetchLiquityV2CollateralsParams,
    ): Promise<LiquityV2Collateral[]> {
        const url = new URL(
            `v1/liquity-v2/${params.chainId}/${params.brand}/collaterals`,
            this.baseUrl,
        );

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching liquity v2 collaterals: ${await response.text()}`,
            );

        const parsedResponse =
            (await response.json()) as BackendLiquityV2CollateralsResponse;

        return parsedResponse.collaterals.map((collateral) => {
            return {
                usdMintedDebt: collateral.mintedDebt,
                usdTvlUsd: collateral.usdTvl,
                usdStabilityPoolDebt: collateral.stabilityPoolDebt,
                token: resolveToken(
                    parsedResponse.resolvedTokens,
                    collateral.address,
                ),
            };
        });
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
                        backendCampaign.target.poolId,
                    ),
                };
                break;
            }
            case "liquity-v2-debt": {
                target = <LiquityV2DebtTarget>{
                    type: TargetType.LiquityV2Debt,
                    brand: {
                        slug: backendCampaign.target
                            .brand as SupportedLiquityV2,
                        name: LIQUITY_V2_BRAND_NAME[
                            backendCampaign.target.brand as SupportedLiquityV2
                        ],
                    },
                    chainId: backendCampaign.target.chainId,
                    collateral: resolveTokenInChain(
                        response.resolvedPricedTokens,
                        backendCampaign.target.chainId,
                        backendCampaign.target.collateral as Address,
                    ),
                };
                break;
            }
            case "liquity-v2-stability-pool": {
                target = <LiquityV2StabilityPoolTarget>{
                    type: TargetType.LiquityV2StabilityPool,
                    brand: {
                        slug: backendCampaign.target
                            .brand as SupportedLiquityV2,
                        name: LIQUITY_V2_BRAND_NAME[
                            backendCampaign.target.brand as SupportedLiquityV2
                        ],
                    },
                    chainId: backendCampaign.target.chainId,
                    collateral: resolveTokenInChain(
                        response.resolvedPricedTokens,
                        backendCampaign.target.chainId,
                        backendCampaign.target.collateral as Address,
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
    id: Hex,
): AmmPool {
    const resolvedPool = poolsRegistry[chainId][id];
    if (!resolvedPool)
        throw new Error(
            `Could not find resolved pool with id ${id} in chain with id ${chainId}`,
        );

    return {
        ...resolvedPool,
        chainId,
        id,
        dex: {
            slug: resolvedPool.dex as SupportedDex,
            name: DEX_BRAND_NAME[resolvedPool.dex as SupportedDex],
        },
        amm: resolvedPool.amm as SupportedAmm,
        tokens: resolvedPool.tokens.map((address) =>
            resolveTokenInChain(tokensRegistry, chainId, address),
        ),
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

function computeSurroundingTicks(
    initializedTicksByIdx: Record<number, InitializedTick>,
    activeTickProcessed: ProcessedTick,
    pool: AmmPool,
    numSurroundingTicks: number = 1000,
    direction: Direction,
): TickWithPrices[] {
    let previousTickProcessed: ProcessedTick = {
        ...activeTickProcessed,
    };

    // Iterate outwards (either up or down depending on 'Direction') from the active tick,
    // building active liquidity for every tick.
    let processedTicks: ProcessedTick[] = [];
    for (let i = 0; i < numSurroundingTicks; i++) {
        const currentTickIdx =
            direction == Direction.Asc
                ? previousTickProcessed.idx + 1
                : previousTickProcessed.idx - 1;

        if (currentTickIdx < MIN_TICK || currentTickIdx > MAX_TICK) {
            break;
        }

        const price0 = tickToScaledPrice(currentTickIdx, pool, true);
        const currentTickProcessed: ProcessedTick = {
            idx: currentTickIdx,
            liquidity: {
                active: previousTickProcessed.liquidity.active,
                net: 0n,
            },
            price0: price0,
            price1: 1 / price0,
        };

        // Check if there is an initialized tick at our current tick.
        // If so copy the net liquidity from the initialized tick.
        const initializedCurrentTick = initializedTicksByIdx[currentTickIdx];
        if (initializedCurrentTick) {
            currentTickProcessed.liquidity.net =
                initializedCurrentTick.liquidityNet;
        }

        // Update the active liquidity.
        // If we are iterating ascending and we found an initialized tick we immediately apply
        // it to the current processed tick we are building.
        // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
        if (direction == Direction.Asc && initializedCurrentTick) {
            currentTickProcessed.liquidity.active =
                previousTickProcessed.liquidity.active +
                initializedCurrentTick.liquidityNet;
        } else if (
            direction == Direction.Desc &&
            previousTickProcessed.liquidity.net != 0n
        ) {
            // We are iterating descending, so look at the previous tick and apply any net liquidity.
            currentTickProcessed.liquidity.active =
                previousTickProcessed.liquidity.active -
                previousTickProcessed.liquidity.net;
        }

        processedTicks.push(currentTickProcessed);
        previousTickProcessed = currentTickProcessed;
    }

    if (direction == Direction.Desc) {
        processedTicks = processedTicks.reverse();
    }

    return processedTicks.map((tick) => {
        return <TickWithPrices>{
            idx: tick.idx,
            liquidity: tick.liquidity.active,
            price0: tick.price0,
            price1: tick.price1,
        };
    });
}

function averageTicks(ticks: TickWithPrices[]) {
    const averagedTicks: TickWithPrices[] = [];
    let averageLiquidity = 0n;

    ticks.forEach((tick, index) => {
        averageLiquidity += tick.liquidity;

        if (index % TICK_AVERAGE_FACTOR === 0) {
            const factor = index > 0 ? BigInt(TICK_AVERAGE_FACTOR) : 1n;
            const liquidity = averageLiquidity / factor;

            averagedTicks.push({
                ...tick,
                liquidity,
            });
            averageLiquidity = 0n;
        }
    });

    return averagedTicks;
}

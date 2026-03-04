import {
    DistributablesType,
    RestrictionType,
    type LiquidityByAddresses,
    type LiquidityInRange,
} from "@metrom-xyz/sdk";
import type {
    BaseCampaignPayload,
    TargetValue,
} from "../types/campaign/common";
import { getDistributableRewardsPercentage } from "./kpi";
import { SECONDS_IN_YEAR } from "../commons";
import type { AmmPoolLiquidityCampaignPayload } from "../types/campaign/amm-pool-liquidity-campaign";

export function allFieldsFilled<T extends object, K extends keyof T>(
    source: T,
    fields: K[],
) {
    return fields.every((field) => !!source[field]);
}

export function arraysEqual(a: unknown[], b: unknown[]): boolean {
    return new Set(a).symmetricDifference(new Set(b)).size === 0;
}

export function distributablesCompleted(payload: BaseCampaignPayload): boolean {
    switch (payload.distributables?.type) {
        case DistributablesType.Tokens: {
            return (
                !!payload.distributables.tokens &&
                payload.distributables.tokens.length > 0
            );
        }
        case DistributablesType.FixedPoints: {
            return (
                !!payload.distributables.fee && !!payload.distributables.points
            );
        }
        default: {
            return false;
        }
    }
}

export function distributablesEqual(
    prev: BaseCampaignPayload,
    current: BaseCampaignPayload,
): boolean {
    if (
        prev.distributables?.type === DistributablesType.Tokens &&
        current.distributables?.type === DistributablesType.Tokens
    ) {
        return (
            new Set(prev.distributables.tokens).symmetricDifference(
                new Set(current.distributables.tokens),
            ).size === 0
        );
    }

    if (
        prev.distributables?.type === DistributablesType.FixedPoints &&
        current.distributables?.type === DistributablesType.FixedPoints
    ) {
        return (
            prev.distributables.fee?.token.address ===
                current.distributables.fee?.token.address &&
            prev.distributables.points === current.distributables.points
        );
    }

    return false;
}

export function weightingEqual(
    prev: AmmPoolLiquidityCampaignPayload,
    current: AmmPoolLiquidityCampaignPayload,
) {
    return (
        prev.weighting?.token0 === current.weighting?.token0 &&
        prev.weighting?.token1 === current.weighting?.token1 &&
        prev.weighting?.liquidity === current.weighting?.liquidity
    );
}

export function getCampaignApr(
    payload: BaseCampaignPayload,
    targetValue?: TargetValue,
    liquidityInRange?: LiquidityInRange,
    liquidityByAddresses?: LiquidityByAddresses,
) {
    if (!payload.startDate || !payload.endDate || !targetValue)
        return undefined;

    const duration = payload.endDate.unix() - payload.startDate.unix();
    if (
        duration <= 0 ||
        !payload.distributables ||
        payload.distributables.type !== DistributablesType.Tokens ||
        !payload.distributables.tokens ||
        payload.distributables.tokens.length === 0
    )
        return undefined;

    const { distributables, kpiSpecification } = payload;

    let rewardsUsdValue = 0;
    for (const reward of distributables.tokens || []) {
        if (!reward.amount.usdValue) return undefined;
        rewardsUsdValue += reward.amount.usdValue;
    }

    let distributableUsdRewards = rewardsUsdValue;
    if (kpiSpecification) {
        distributableUsdRewards *= getDistributableRewardsPercentage(
            targetValue.usd,
            kpiSpecification.goal.lowerUsdTarget,
            kpiSpecification.goal.upperUsdTarget,
            kpiSpecification.minimumPayoutPercentage,
        );
    }

    let totalUsdTvl = targetValue.usd;
    if (liquidityInRange) {
        const multiplier =
            Math.min(
                Number(
                    (liquidityInRange.liquidity * 1_000_000n) /
                        liquidityInRange.activeTick.liquidity,
                ),
                1_000_000,
            ) / 1_000_000;

        totalUsdTvl = targetValue.usd * multiplier;
    } else if (liquidityByAddresses) {
        if (!targetValue.raw) {
            console.error(
                "Missing raw liquidity while calculating APR for liquidity by addresses",
            );
            return undefined;
        }

        const adjustedLiquidity =
            liquidityByAddresses.type === RestrictionType.Blacklist
                ? targetValue.raw - liquidityByAddresses.liquidity
                : liquidityByAddresses.liquidity;

        const multiplier =
            Math.min(
                Number((adjustedLiquidity * 1_000_000n) / targetValue.raw),
                1_000_000,
            ) / 1_000_000;

        totalUsdTvl = targetValue.usd * multiplier;
    }

    const rewardsRatio = distributableUsdRewards / totalUsdTvl;
    const yearMultiplier = SECONDS_IN_YEAR / duration;
    const aprPercentage = rewardsRatio * yearMultiplier * 100;

    return aprPercentage;
}

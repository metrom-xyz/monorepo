import {
    DistributablesType,
    RestrictionType,
    type LiquidityByAddresses,
    type LiquidityInRange,
} from "@metrom-xyz/sdk";
import type {
    BaseCampaignPayload,
    CampaignPayloadDistributables,
    CampaignPayloadFixedDistribution,
    CampaignPayloadKpiDistribution,
    CampaignPreviewDistributables,
    TargetValue,
} from "../types/campaign/common";
import { getDistributableRewardsPercentage } from "./kpi";
import { SECONDS_IN_YEAR } from "../commons";
import type {
    AmmPoolLiquidityCampaignPayload,
    AugmentedPriceRangeSpecification,
} from "../types/campaign/amm-pool-liquidity-campaign";

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

export function kpiSpecificationCompleted(
    payload: BaseCampaignPayload,
): boolean {
    const { kpiDistribution } = payload;

    return (
        kpiDistribution?.goal?.metric !== undefined &&
        kpiDistribution.goal.lowerUsdTarget !== undefined &&
        kpiDistribution.goal.upperUsdTarget !== undefined
    );
}

export function rangeSpecificationCompleted(
    payload: AmmPoolLiquidityCampaignPayload,
): boolean {
    const { priceRangeSpecification } = payload;

    return (
        priceRangeSpecification?.token0To1 !== undefined &&
        priceRangeSpecification?.from?.price !== undefined &&
        !!priceRangeSpecification?.from.tick &&
        priceRangeSpecification?.to?.price !== undefined &&
        !!priceRangeSpecification?.to.tick
    );
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
            prev.distributables.fee?.amount.raw ===
                current.distributables.fee?.amount.raw &&
            prev.distributables.points === current.distributables.points
        );
    }

    return false;
}

export function restrictionsEqual(
    prev: BaseCampaignPayload,
    current: BaseCampaignPayload,
): boolean {
    if (
        prev.restrictions?.list.length === 0 &&
        current.restrictions?.list.length === 0
    )
        return true;

    return (
        prev.restrictions?.type === current.restrictions?.type &&
        new Set(prev.restrictions?.list).symmetricDifference(
            new Set(current.restrictions?.list),
        ).size === 0
    );
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

export function fixedDistributionsEqual(
    prev: BaseCampaignPayload,
    current: BaseCampaignPayload,
) {
    return prev.fixedDistribution?.apr === current.fixedDistribution?.apr;
}

export function kpisEqual(
    prev: BaseCampaignPayload,
    current: BaseCampaignPayload,
) {
    return (
        prev.kpiDistribution?.goal?.metric ===
            current.kpiDistribution?.goal?.metric &&
        prev.kpiDistribution?.goal?.lowerUsdTarget ===
            current.kpiDistribution?.goal?.lowerUsdTarget &&
        prev.kpiDistribution?.goal?.upperUsdTarget ===
            current.kpiDistribution?.goal?.upperUsdTarget &&
        prev.kpiDistribution?.minimumPayoutPercentage ===
            current.kpiDistribution?.minimumPayoutPercentage
    );
}

export function rangesEqual(
    prev: AmmPoolLiquidityCampaignPayload,
    current: AmmPoolLiquidityCampaignPayload,
) {
    return (
        prev.priceRangeSpecification?.from?.tick ===
            current.priceRangeSpecification?.from?.tick &&
        prev.priceRangeSpecification?.to?.tick ===
            current.priceRangeSpecification?.to?.tick
    );
}

export function validateDistributables(
    distributables: CampaignPayloadDistributables,
): distributables is CampaignPreviewDistributables {
    if (
        distributables.type === DistributablesType.FixedPoints &&
        (!distributables.fee || !distributables.type)
    )
        return false;
    if (
        distributables.type === DistributablesType.Tokens &&
        (!distributables.tokens || distributables.tokens.length === 0)
    )
        return false;

    return true;
}

export function validatePriceRangeSpecification(
    priceRangeSpecification: Partial<AugmentedPriceRangeSpecification>,
): priceRangeSpecification is AugmentedPriceRangeSpecification {
    if (
        !priceRangeSpecification.from ||
        !priceRangeSpecification.to ||
        priceRangeSpecification.token0To1 === undefined
    )
        return false;

    return true;
}

export function validateDistributions(
    kpiDistribution?: CampaignPayloadKpiDistribution,
    fixedDistribution?: CampaignPayloadFixedDistribution,
) {
    if (kpiDistribution && fixedDistribution) return false;
    if (kpiDistribution && !kpiDistribution.goal) return false;
    if (fixedDistribution && !fixedDistribution.apr) return false;

    return true;
}

export function getCampaignFormApr(
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

    const { distributables, kpiDistribution } = payload;

    let rewardsUsdValue = 0;
    for (const reward of distributables.tokens || []) {
        if (!reward.amount.usdValue) return undefined;
        rewardsUsdValue += reward.amount.usdValue;
    }

    let distributableUsdRewards = rewardsUsdValue;
    if (
        kpiDistribution &&
        kpiDistribution.goal &&
        kpiDistribution.goal.lowerUsdTarget !== undefined &&
        kpiDistribution.goal.upperUsdTarget !== undefined
    ) {
        distributableUsdRewards *= getDistributableRewardsPercentage(
            targetValue.usd,
            kpiDistribution.goal.lowerUsdTarget,
            kpiDistribution.goal.upperUsdTarget,
            kpiDistribution.minimumPayoutPercentage,
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

export function getUsdBudgetForFixedApr(
    referenceTvl: number,
    bufferPercentage: number,
    daysDuration: number,
    apr?: number,
) {
    if (!apr) return 0;
    return (
        referenceTvl *
        (apr / 100) *
        (daysDuration / 365) *
        (1 + bufferPercentage / 100)
    );
}

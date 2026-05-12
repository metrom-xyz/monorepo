export const FIXED_APR_BUDGET_SCALE = 1_000_000n;
export const FIXED_APR_BPS_UNIT = 10_000n;
export const MINUTES_PER_YEAR = 365n * 24n * 60n;

export function getRawUsdBudgetForFixedApr(
    referenceTvl: number,
    bufferBps: bigint,
    minutesDuration: bigint,
    aprBps: bigint,
): bigint {
    const tvlScaled = BigInt(Math.round(referenceTvl * 1_000_000));
    const timeRatio =
        (minutesDuration * FIXED_APR_BUDGET_SCALE) / MINUTES_PER_YEAR;
    const budget = tvlScaled * aprBps * timeRatio;
    const budgetWithBuffer = budget * (FIXED_APR_BPS_UNIT + bufferBps);

    return (
        budgetWithBuffer /
        (FIXED_APR_BUDGET_SCALE * FIXED_APR_BPS_UNIT * FIXED_APR_BPS_UNIT)
    );
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

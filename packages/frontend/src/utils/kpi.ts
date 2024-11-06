export function getReachedGoalPercentage(
    usdTvl: number,
    lowerUsdTarget: number,
    upperUsdTarget: number,
) {
    return Math.min(
        1,
        Math.max(0, usdTvl - lowerUsdTarget) /
            (upperUsdTarget - lowerUsdTarget),
    );
}

export function getDistributableRewardsPercentage(
    usdTvl: number,
    lowerUsdTarget: number,
    upperUsdTarget: number,
    minimumPayoutPercentage?: number,
) {
    const reachedPercentage = getReachedGoalPercentage(
        usdTvl,
        lowerUsdTarget,
        upperUsdTarget,
    );
    let minPayoutPercentage = minimumPayoutPercentage || 0;
    const goalBoundPercentage = 1 - minPayoutPercentage;
    const goalReachedPercentage = goalBoundPercentage * reachedPercentage;

    return minPayoutPercentage + goalReachedPercentage;
}

// Manually calculate the Y coordinates on the chart based on the axis value.
// This is necessary to correctly position the circle in the tooltip cursor.
export function getChartYScale(
    value: number,
    minValue: number,
    maxValue: number,
    minHeight: number,
    maxHeight: number,
) {
    return (
        ((value - minValue) / (maxValue - minValue)) * (maxHeight - minHeight) +
        minHeight
    );
}

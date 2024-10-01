export const getReachedGoalPercentage = (
    tvl?: number,
    lowerBound?: number,
    upperBound?: number,
) => {
    if (
        tvl === undefined ||
        lowerBound === undefined ||
        upperBound === undefined
    )
        return 0;

    if (tvl < lowerBound) return 0;
    if (tvl >= upperBound) return 1;

    const totalRange = upperBound - lowerBound;
    const reachedRange = tvl - lowerBound;
    const reachedPercentage = reachedRange / totalRange;
    return reachedPercentage;
};

export const getDistributableRewardsPercentage = (
    tvl?: number,
    lowerBound?: number,
    upperBound?: number,
    minimumPayoutPercentage?: number,
) => {
    const reachedPercentage = getReachedGoalPercentage(
        tvl,
        lowerBound,
        upperBound,
    );

    let minPayoutPercentage = minimumPayoutPercentage || 0;
    const goalBoundPercentage = 1 - minPayoutPercentage;
    const goalReachedPercentage = goalBoundPercentage * reachedPercentage;

    return minPayoutPercentage + goalReachedPercentage;
};

// Manually calculate the Y coordinates on the chart based on the axis value.
// This is necessary to correctly position the circle in the tooltip cursor.
export const getChartYScale = (
    value: number,
    minValue: number,
    maxValue: number,
    minHeight: number,
    maxHeight: number,
) => {
    return (
        ((value - minValue) / (maxValue - minValue)) * (maxHeight - minHeight) +
        minHeight
    );
};

import type { KpiMeasurement } from "@metrom-xyz/sdk";

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

export function getAggregatedKpiMeasurements(
    kpiMeasurements: KpiMeasurement[],
    seconds: number,
): KpiMeasurement[] {
    if (kpiMeasurements.length === 0) return kpiMeasurements;

    let window = [];
    const aggregated: KpiMeasurement[] = [];
    for (const measurement of kpiMeasurements) {
        if (window.length === 0 || measurement.to - window[0].from < seconds) {
            window.push(measurement);
            continue;
        }

        let distributions = [];
        let percentageSum = 0;
        let valueSum = 0;
        for (const item of window) {
            distributions.push(...item.distributions);
            percentageSum += item.percentage;
            valueSum += item.value;
        }

        aggregated.push({
            from: window[0].from,
            to: window[window.length - 1].to,
            distributions,
            percentage: percentageSum / window.length,
            value: valueSum / window.length,
        });
        window = [];
    }

    return aggregated;
}

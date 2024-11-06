import type { KpiMeasurement, KpiRewardDistribution } from "@metrom-xyz/sdk";
import type { Address } from "viem";

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
    kpiMeasurement?: number,
) {
    let reachedPercentage = getReachedGoalPercentage(
        usdTvl,
        lowerUsdTarget,
        upperUsdTarget,
    );

    if (kpiMeasurement)
        reachedPercentage = Math.min(Math.max(kpiMeasurement, 0), 1);

    let minPayoutPercentage = minimumPayoutPercentage || 0;
    const goalBoundPercentage = 1 - minPayoutPercentage;
    const goalReachedPercentage = goalBoundPercentage * reachedPercentage;

    return minPayoutPercentage + goalReachedPercentage;
}

// manually calculate the Y coordinates on the chart based on the axis value.
// This is necessary to correctly position the circle in the tooltip cursor.
export function getChartAxisScale(
    value: number,
    minValue: number,
    maxValue: number,
    min: number,
    max: number,
) {
    return ((value - minValue) / (maxValue - minValue)) * (max - min) + min;
}

export function isChartAxisTickActive(value: number, scale: number) {
    return Math.round(value * 100) / 100 === Math.round(scale * 100) / 100;
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

        const distributionsByToken = distributions.reduce(
            (acc: Record<string, KpiRewardDistribution>, distribution) => {
                const { distributed, reimbursed, token } = distribution;

                const address = token.address.toLowerCase();

                if (!acc[address]) {
                    acc[address] = {
                        ...distribution,
                        distributed: { ...distributed },
                        reimbursed: { ...reimbursed },
                    };
                } else {
                    acc[address].distributed.raw += distributed.raw;
                    acc[address].distributed.formatted += distributed.formatted;
                    acc[address].distributed.usdValue += distributed.usdValue;

                    acc[address].reimbursed.raw += reimbursed.raw;
                    acc[address].reimbursed.formatted += reimbursed.formatted;
                    acc[address].reimbursed.usdValue += reimbursed.usdValue;
                }

                return acc;
            },
            {},
        );

        aggregated.push({
            from: window[0].from,
            to: window[window.length - 1].to,
            distributions: Object.values(distributionsByToken),
            percentage: percentageSum / window.length,
            value: valueSum / window.length,
        });
        window = [];
    }

    return aggregated;
}

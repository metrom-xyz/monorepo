import type {
    TokenDistributables,
    UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";

interface RewardsPercentage {
    distributed: number;
    reimbursed: number;
}

interface UseRewardsDistributionBreakdownParams {
    distributables?: TokenDistributables;
    kpiMeasurementPercentage?: number;
    minimumPayoutPercentage?: number;
}

export interface RewardsDistributionBreakdown {
    percentages: RewardsPercentage;
    distributedUsdValue: number;
    reimbursedUsdValue: number;
    distributedList: UsdPricedErc20TokenAmount[];
    reimbursedList: UsdPricedErc20TokenAmount[];
}

export function useRewardsDistributionBreakdown({
    distributables,
    kpiMeasurementPercentage,
    minimumPayoutPercentage,
}: UseRewardsDistributionBreakdownParams):
    | RewardsDistributionBreakdown
    | undefined {
    const percentages: RewardsPercentage | undefined = useMemo(() => {
        if (!kpiMeasurementPercentage) return undefined;

        const normalizedKpiMeasurementPercentage = Math.max(
            Math.min(kpiMeasurementPercentage, 1),
            0,
        );
        const minimumPayout = minimumPayoutPercentage || 0;

        const distributed =
            (minimumPayout +
                (1 - minimumPayout) * normalizedKpiMeasurementPercentage) *
            100;
        const reimbursed = 100 - distributed;

        return {
            distributed,
            reimbursed,
        };
    }, [kpiMeasurementPercentage, minimumPayoutPercentage]);

    const breakdown = useMemo(() => {
        if (!distributables || !percentages) return undefined;

        const { amountUsdValue, remainingUsdValue } = distributables;
        const { distributed, reimbursed } = percentages;

        const assignedUsdValue = amountUsdValue - remainingUsdValue;
        const distributedUsdValue = (assignedUsdValue * distributed) / 100;
        const reimbursedUsdValue = (assignedUsdValue * reimbursed) / 100;

        const distributedList: UsdPricedErc20TokenAmount[] = [];
        const reimbursedList: UsdPricedErc20TokenAmount[] = [];

        distributables.list.forEach(({ amount, remaining, token }) => {
            const assignedAmount = amount.formatted - remaining.formatted;
            const distributedAmount = (assignedAmount * distributed) / 100;
            const reimbursedAmount = (assignedAmount * reimbursed) / 100;

            distributedList.push({
                token,
                amount: {
                    formatted: distributedAmount,
                    raw: 0n,
                    usdValue: distributedAmount * token.usdPrice,
                },
            });
            reimbursedList.push({
                token,
                amount: {
                    formatted: reimbursedAmount,
                    raw: 0n,
                    usdValue: reimbursedAmount * token.usdPrice,
                },
            });
        });

        return {
            percentages,
            distributedUsdValue,
            reimbursedUsdValue,
            distributedList,
            reimbursedList,
        };
    }, [distributables, percentages]);

    return breakdown;
}

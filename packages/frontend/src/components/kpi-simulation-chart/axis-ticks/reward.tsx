import { usePlotArea, useYAxisScale } from "recharts";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RewardTickProps {
    payload?: {
        value?: number;
    };
    x?: number;
    y?: number;
    complex?: boolean;
    minPayoutUsd: number;
    minPayoutPercentage: number;
    currentPayoutUsd: number;
    totalRewardsUsd: number;
}

export function RewardTick({
    payload,
    x,
    y,
    complex,
    minPayoutUsd,
    minPayoutPercentage,
    currentPayoutUsd,
    totalRewardsUsd,
}: RewardTickProps) {
    const t = useTranslations("simulationChart.axis");
    const yScale = useYAxisScale();
    const plotArea = usePlotArea();

    if (!payload || payload.value === undefined || !y || !yScale || !plotArea)
        return null;

    const tickValue = payload.value;

    // Complex chart has a 2 rows label
    const elementHeight = complex ? 24 : 14;

    // shift the label up when it would overlap the label of a close tick
    // with a lower value
    let adjustedY = y;
    const lowerTickValues = [minPayoutUsd, currentPayoutUsd].filter(
        (value) => value !== tickValue && value < tickValue,
    );
    for (const value of lowerTickValues) {
        const lowerTickY = yScale(value);
        if (lowerTickY === undefined) continue;

        const gap = lowerTickY - adjustedY;
        if (gap >= 0 && gap < elementHeight) adjustedY -= elementHeight - gap;
    }

    // keep the label inside the plot area
    const bottom = adjustedY + elementHeight;
    const overflow = Math.max(0, bottom - (plotArea.y + plotArea.height));
    adjustedY -= overflow;

    const isMinimumPayout = minPayoutUsd > 0 && payload.value === minPayoutUsd;

    // a single tick can match multiple values (e.g. current payout equal to
    // the total rewards), so the labels are merged in a single row
    const labels: string[] = [];
    if (complex) {
        if (payload.value === currentPayoutUsd)
            labels.push(t("currentRewards"));
        if (isMinimumPayout) labels.push(t("minPayout"));
        if (payload.value === totalRewardsUsd) labels.push(t("totRewards"));
    }

    return (
        <g transform={`translate(${x},${adjustedY})`}>
            <text
                x={-10}
                y={-3}
                dy={0}
                className={classNames(styles.axis, {
                    [styles.complex]: complex,
                })}
            >
                {formatUsdAmount({ amount: payload.value })}
                {complex && isMinimumPayout && minPayoutPercentage > 0 && (
                    <tspan
                        dx={2}
                        dy={0}
                        className={classNames(styles.axis, styles.tertiary)}
                    >
                        (
                        {formatPercentage({
                            percentage: minPayoutPercentage * 100,
                        })}
                        )
                    </tspan>
                )}
            </text>
            {labels.length > 0 && (
                <text
                    x={-10}
                    y={-3}
                    dy={12}
                    className={classNames(styles.axis, styles.tertiary)}
                >
                    {labels.join(" · ")}
                </text>
            )}
        </g>
    );
}

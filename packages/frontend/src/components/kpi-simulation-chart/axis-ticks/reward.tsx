import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { MAX_AREA_HEIGHT } from "..";

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

const MIN_AXIS_MARGIN = 0;

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

    if (!payload || payload.value === undefined || !y) return null;

    // Complex chart has a 2 rows label
    const elementHeight = complex ? 28 : 14;

    const bottom = y + elementHeight;
    const overflow = Math.max(0, bottom - (MAX_AREA_HEIGHT - MIN_AXIS_MARGIN));
    const adjustedY = y - overflow;

    const isMinimumPayout = minPayoutUsd > 0 && payload.value === minPayoutUsd;

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
            {complex && payload.value === currentPayoutUsd && (
                <text
                    x={-10}
                    y={-3}
                    dy={12}
                    className={classNames(styles.axis, styles.tertiary)}
                >
                    {t("currentRewards")}
                </text>
            )}
            {complex && isMinimumPayout && (
                <text
                    x={-10}
                    y={-3}
                    dy={12}
                    className={classNames(styles.axis, styles.tertiary)}
                >
                    {t("minPayout")}
                </text>
            )}
            {complex && payload.value === totalRewardsUsd && (
                <text
                    x={-10}
                    y={-3}
                    dy={12}
                    className={classNames(styles.axis, styles.tertiary)}
                >
                    {t("totRewards")}
                </text>
            )}
        </g>
    );
}

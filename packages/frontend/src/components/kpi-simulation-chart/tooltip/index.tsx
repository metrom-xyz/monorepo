import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography, type TypographySize } from "@metrom-xyz/ui";
import {
    ReferenceLine,
    useYAxisScale,
    type TooltipContentProps,
} from "recharts";
import { type DistributedAreaDataPoint } from "..";
import {
    getDistributableRewardsPercentage,
    getReachedGoalPercentage,
} from "@/src/utils/kpi";
import classNames from "classnames";

type KpiTooltipContentProps = TooltipContentProps & {
    size?: TypographySize;
    targetValueName: string;
    lowerUsdTarget: number;
    upperUsdTarget: number;
    totalRewardsUsd: number;
    minimumPayouPercentage?: number;
};

export function TooltipContent({
    active,
    payload,
    size = "base",
    targetValueName,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    minimumPayouPercentage,
}: KpiTooltipContentProps) {
    const t = useTranslations("simulationChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { targetUsdValue, aprPercentage }: DistributedAreaDataPoint =
        payload[0].payload;

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography
                    weight="medium"
                    variant="tertiary"
                    uppercase
                    size={size}
                >
                    {targetValueName}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatUsdAmount({ amount: targetUsdValue })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography
                    weight="medium"
                    variant="tertiary"
                    uppercase
                    size={size}
                >
                    {t("payout")}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatUsdAmount({
                        amount:
                            totalRewardsUsd *
                            getDistributableRewardsPercentage(
                                targetUsdValue,
                                lowerUsdTarget,
                                upperUsdTarget,
                                minimumPayouPercentage,
                            ),
                    })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography
                    weight="medium"
                    variant="tertiary"
                    uppercase
                    size={size}
                >
                    {t("kpiReached")}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatPercentage({
                        percentage:
                            getReachedGoalPercentage(
                                targetUsdValue,
                                lowerUsdTarget,
                                upperUsdTarget,
                            ) * 100,
                    })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography
                    weight="medium"
                    variant="tertiary"
                    uppercase
                    size={size}
                >
                    {t("apr")}
                </Typography>
                <div className={styles.aprChip}>
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.aprText}
                    >
                        {formatPercentage({ percentage: aprPercentage })}
                    </Typography>
                </div>
            </div>
        </div>
    );
}

interface TooltipCursorProps {
    payload?: {
        payload: DistributedAreaDataPoint;
    }[];
    points?: { x: number; y: number }[];
}

export function TooltipCursor({ payload, points }: TooltipCursorProps) {
    const yScale = useYAxisScale();

    if (!payload || !payload.length || !points || !yScale) return null;

    const {
        targetUsdValue,
        currentlyDistributing,
        currentlyNotDistributing,
        aprLinePoint,
    } = payload[0].payload;
    const reward = currentlyDistributing || currentlyNotDistributing;

    // ReferenceDot cannot be used to position the circles in the cursor, so
    // we use standard SVG circle elements, resolving the Y positions through
    // the recharts Y axis scale, while the X position can directly use the
    // value from the data points.
    const cyRewards = yScale(reward);
    const cyApr = aprLinePoint !== undefined ? yScale(aprLinePoint) : undefined;

    return (
        <>
            <ReferenceLine
                strokeDasharray={"4 4"}
                ifOverflow="visible"
                segment={[
                    { x: targetUsdValue, y: reward },
                    { x: 0, y: reward },
                ]}
                className={styles.referenceLine}
            />
            <ReferenceLine
                strokeDasharray={"4 4"}
                ifOverflow="visible"
                segment={[
                    { x: targetUsdValue, y: reward },
                    { x: targetUsdValue, y: 0 },
                ]}
                className={styles.referenceLine}
            />
            {cyRewards !== undefined && (
                <circle
                    cx={points[0].x}
                    cy={cyRewards}
                    r={5}
                    strokeWidth={2}
                    className={styles.referenceCircle}
                />
            )}
            {cyApr !== undefined && (
                <circle
                    cx={points[0].x}
                    cy={cyApr}
                    r={5}
                    strokeWidth={2}
                    className={classNames(styles.referenceCircle, styles.apr)}
                />
            )}
        </>
    );
}

import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { ReferenceLine } from "recharts";
import { CHART_MARGINS, type DistributedAreaDataPoint } from "..";
import {
    getChartAxisScale,
    getDistributableRewardsPercentage,
    getReachedGoalPercentage,
} from "@/src/utils/kpi";
import { AprChip } from "../../apr-chip";

interface TooltipProps {
    active?: boolean;
    payload?: [
        {
            payload: DistributedAreaDataPoint;
        },
    ];
    size?: TypographySize;
    lowerUsdTarget: number;
    upperUsdTarget: number;
    totalRewardsUsd: number;
    minimumPayouPercentage?: number;
}

export function TooltipContent({
    active,
    payload,
    size = "base",
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    minimumPayouPercentage,
}: TooltipProps) {
    const t = useTranslations("simulationChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { usdTvl, aprPercentage } = payload[0].payload;

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase size={size}>
                    {t("tvl")}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatUsdAmount({ amount: usdTvl })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase size={size}>
                    {t("payout")}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatUsdAmount({
                        amount:
                            totalRewardsUsd *
                            getDistributableRewardsPercentage(
                                usdTvl,
                                lowerUsdTarget,
                                upperUsdTarget,
                                minimumPayouPercentage,
                            ),
                    })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase size={size}>
                    {t("kpiReached")}
                </Typography>
                <Typography weight="medium" size={size}>
                    {formatPercentage({
                        percentage:
                            getReachedGoalPercentage(
                                usdTvl,
                                lowerUsdTarget,
                                upperUsdTarget,
                            ) * 100,
                    })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase size={size}>
                    {t("apr")}
                </Typography>
                <AprChip apr={aprPercentage} size={size} kpi />
            </div>
        </div>
    );
}

interface TooltipCursorProps {
    totalRewardsUsd: number;
    height?: number;
    payload?: [
        {
            payload: DistributedAreaDataPoint;
        },
    ];
    points?: { x: number; y: number }[];
}

export function TooltipCursor({
    totalRewardsUsd,
    height,
    payload,
    points,
}: TooltipCursorProps) {
    if (!payload || !payload.length || !points || !height) return null;

    const {
        usdTvl,
        currentlyDistributing,
        currentlyNotDistributing,
        aprLinePoint,
    } = payload[0].payload;
    const reward = currentlyDistributing || currentlyNotDistributing;

    // ReferenceDot cannot be used because it lacks access to Recharts' internal scale functions.
    // Instead, we use a standard SVG circle element. This requires manually calculating the Y position
    // based on the chart scale, while the X position can directly use the value from the data points.
    // This also takes into account the chart top margin.
    const cyRewards =
        getChartAxisScale(reward, 0, totalRewardsUsd, height, 0) +
        CHART_MARGINS.top;
    const cyApr =
        getChartAxisScale(aprLinePoint!, 0, totalRewardsUsd, height, 0) +
        CHART_MARGINS.top;

    return (
        <>
            <ReferenceLine
                strokeDasharray={"3 3"}
                ifOverflow="visible"
                segment={[
                    { x: usdTvl, y: reward },
                    { x: 0, y: reward },
                ]}
                className={styles.referenceLine}
            />
            <ReferenceLine
                strokeDasharray={"3 3"}
                ifOverflow="visible"
                segment={[{ x: usdTvl }, { x: usdTvl, y: 0 }]}
                className={styles.referenceLine}
            />
            {cyRewards && (
                <circle
                    cx={points[0].x}
                    cy={cyRewards}
                    r={4}
                    strokeWidth={1}
                    className={styles.referenceCircle}
                />
            )}
            {cyApr && (
                <circle
                    cx={points[0].x}
                    cy={cyApr}
                    r={4}
                    strokeWidth={1}
                    className={styles.referenceCircle}
                />
            )}
        </>
    );
}

import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { ReferenceLine } from "recharts";
import { CHART_MARGINS, type DistributedAreaDataPoint } from "..";
import {
    getChartYScale,
    getDistributableRewardsPercentage,
    getReachedGoalPercentage,
} from "@/src/utils/kpi";

interface TooltipProps {
    active?: boolean;
    payload?: [
        {
            payload: DistributedAreaDataPoint;
        },
    ];
    lowerUsdTarget: number;
    upperUsdTarget: number;
    totalRewardsUsd: number;
    minimumPayouPercentage?: number;
}

export function TooltipContent({
    active,
    payload,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    minimumPayouPercentage,
}: TooltipProps) {
    const t = useTranslations("simulationChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { usdTvl } = payload[0].payload;

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase>
                    {t("tvl")}
                </Typography>
                <Typography weight="medium">
                    {formatUsdAmount(usdTvl)}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase>
                    {t("payout")}
                </Typography>
                <Typography weight="medium">
                    {formatUsdAmount(
                        totalRewardsUsd *
                            getDistributableRewardsPercentage(
                                usdTvl,
                                lowerUsdTarget,
                                upperUsdTarget,
                                minimumPayouPercentage,
                            ),
                    )}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light uppercase>
                    {t("kpiReached")}
                </Typography>
                <Typography weight="medium">
                    {formatPercentage(
                        getReachedGoalPercentage(
                            usdTvl,
                            lowerUsdTarget,
                            upperUsdTarget,
                        ) * 100,
                    )}
                </Typography>
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

    const { usdTvl, currentlyDistributing, currentlyNotDistributing } =
        payload[0].payload;
    const reward = currentlyDistributing || currentlyNotDistributing;

    // ReferenceDot cannot be used because it lacks access to Recharts' internal scale functions.
    // Instead, we use a standard SVG circle element. This requires manually calculating the Y position
    // based on the chart scale, while the X position can directly use the value from the data points.
    // This also takes into account the chart top margin.
    const cy =
        getChartYScale(reward, 0, totalRewardsUsd, height, 0) +
        CHART_MARGINS.top;

    return (
        <>
            <ReferenceLine
                strokeDasharray={"3 3"}
                ifOverflow="visible"
                isFront
                stroke="#000"
                segment={[
                    { x: usdTvl, y: reward },
                    { x: 0, y: reward },
                ]}
            />
            <ReferenceLine
                strokeDasharray={"3 3"}
                ifOverflow="visible"
                isFront
                stroke="#000"
                segment={[
                    { x: usdTvl, y: reward },
                    { x: usdTvl, y: 0 },
                ]}
            />
            <circle
                cx={points[0].x}
                cy={cy}
                r={4}
                fill="#000"
                stroke="white"
                strokeWidth={1}
            />
        </>
    );
}

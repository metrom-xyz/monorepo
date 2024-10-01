import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { ReferenceLine } from "recharts";
import { CHART_MARGINS, type ChartData } from "..";
import { getChartYScale } from "@/src/utils/kpi";

interface Payload {
    payload: ChartData;
}

interface TooltipProps {
    active?: boolean;
    payload?: Payload[];
}

interface TooltipCursorProps {
    totalRewardsUsd: number;
    height?: number;
    payload?: Payload[];
    points?: { x: number; y: number }[];
}

export function TooltipContent({ active, payload }: TooltipProps) {
    const t = useTranslations("simulationChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { tvl, reward, goalReachedPercentage } = payload[0].payload;

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography weight="medium" light>
                    {t("tvl")}
                </Typography>
                <Typography weight="medium">{formatUsdAmount(tvl)}</Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light>
                    {t("payout")}
                </Typography>
                <Typography weight="medium">
                    {formatUsdAmount(reward)}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" light>
                    {t("kpiReached")}
                </Typography>
                <Typography weight="medium">
                    {formatPercentage(goalReachedPercentage * 100)}
                </Typography>
            </div>
        </div>
    );
}

export function TooltipCursor({
    totalRewardsUsd,
    height,
    payload,
    points,
}: TooltipCursorProps) {
    if (!payload || !payload.length || !points || !height) return null;

    const { tvl, reward } = payload[0].payload;

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
                stroke="#B2B2B2"
                segment={[
                    { x: tvl, y: reward },
                    { x: 0, y: reward },
                ]}
            />
            <ReferenceLine
                strokeDasharray={"3 3"}
                ifOverflow="visible"
                isFront
                stroke="#B2B2B2"
                segment={[
                    { x: tvl, y: reward },
                    { x: tvl, y: 0 },
                ]}
            />
            <circle
                cx={points[0].x}
                cy={cy}
                r={4}
                fill="#B2B2B2"
                stroke="white"
                strokeWidth={1}
            />
        </>
    );
}

import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { ReferenceLine } from "recharts";
import type { ChartData } from "..";

interface TooltipProps {
    totalRewardsUsd: number;
    lowerUsdTarget: number;
    upperUsdTarget: number;
    minimumPayoutPercentage: number;
}

interface TooltipCursorProps {}

export function TooltipContent({
    totalRewardsUsd,
    lowerUsdTarget,
    upperUsdTarget,
    minimumPayoutPercentage,
    ...rest
}: TooltipProps) {
    const t = useTranslations("simulationChart.tooltip");

    const { active, payload } = rest as any;

    if (!active || !payload || !payload.length) return null;

    const { tvl, reward, goalReachedPercentage } = payload[0]
        .payload as ChartData;

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
                    {formatPercentage(goalReachedPercentage)}
                </Typography>
            </div>
        </div>
    );
}

export function TooltipCursor({ ...rest }: TooltipCursorProps) {
    const { payload } = rest as any;
    const { tvl, reward } = payload[0].payload as ChartData;

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
        </>
    );
}

import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { ReferenceLine } from "recharts";
import type { ChartData } from "..";

interface Payload {
    payload: ChartData;
}

interface TooltipProps {
    active?: boolean;
    payload?: Payload[];
}

interface TooltipCursorProps {
    payload?: Payload[];
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
                    {formatPercentage(goalReachedPercentage)}
                </Typography>
            </div>
        </div>
    );
}

export function TooltipCursor({ payload }: TooltipCursorProps) {
    if (!payload || !payload.length) return null;

    const { tvl, reward } = payload[0].payload;

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

import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import type { AverageDistributionChartData } from "..";

import styles from "./styles.module.css";

interface Payload {
    value: number;
    payload: AverageDistributionChartData;
}

interface RankTooltipProps {
    payload?: Payload[];
}

export function RankTooltip({ payload }: RankTooltipProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    if (!payload || !payload.length) return null;

    const color = payload[0].payload.color;

    return (
        <div className={styles.root}>
            <Typography
                weight="bold"
                uppercase
                style={{
                    color,
                }}
            >
                {t(payload[0].payload.type)}
            </Typography>
            <Typography weight="bold" size="xl2">
                {formatPercentage({ percentage: payload[0].value })}
            </Typography>
        </div>
    );
}

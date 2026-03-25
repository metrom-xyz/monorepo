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

    return (
        <div className={styles.root}>
            <Typography weight="bold" size="xl2">
                {formatPercentage({ percentage: payload[0].value })}
            </Typography>
            <Typography size="sm" variant="tertiary">
                {t(payload[0].payload.type)}
            </Typography>
        </div>
    );
}

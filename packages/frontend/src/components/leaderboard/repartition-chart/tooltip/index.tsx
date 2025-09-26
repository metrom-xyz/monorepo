import { formatPercentage } from "@/src/utils/format";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { RepartitionChartData } from "..";

import styles from "./styles.module.css";

interface Payload {
    value: number;
    payload: RepartitionChartData;
}

interface RankTooltipProps {
    payload?: Payload[];
}

export function RankTooltip({ payload }: RankTooltipProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    if (!payload || !payload.length) return null;

    const color = payload[0].payload.color;

    return (
        <div className={styles.root}>
            <Typography
                weight="bold"
                size="xl"
                style={{
                    color,
                }}
            >
                {payload[0].payload.position
                    ? `#${payload[0].payload.position}`
                    : t("others")}
            </Typography>
            <Typography weight="bold" size="xl2">
                {formatPercentage({ percentage: payload[0].value })}
            </Typography>
        </div>
    );
}

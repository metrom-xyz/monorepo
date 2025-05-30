import {
    formatAmount,
    formatDateTime,
    formatPercentage,
} from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { DistributionChartData } from "..";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";

import styles from "./styles.module.css";

interface Payload {
    payload: DistributionChartData;
}

interface TooltipProps {
    chain?: SupportedChain;
    active?: boolean;
    payload?: Payload[];
}

export function TooltipContent({ chain, active, payload }: TooltipProps) {
    const t = useTranslations("distributionChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { timestamp, weights, tokens } = payload[0].payload;

    return (
        <div className={styles.root}>
            <Typography>{formatDateTime(dayjs.unix(timestamp))}</Typography>
            {Object.entries(weights).map(([token, weight]) => {
                return (
                    <div key={token} className={styles.tokenRow}>
                        <Typography>{token}</Typography>
                        {/* {Object.entries(weight)
                            .sort(
                                (a, b) =>
                                    b[1].percentage.formatted -
                                    a[1].percentage.formatted,
                            )
                            .map(([account, { amount, percentage }]) => (
                                <div key={account} className={styles.weightRow}>
                                    <Typography>{account}</Typography>
                                    <Typography>
                                        {formatPercentage({
                                            percentage: percentage.formatted,
                                        })}
                                    </Typography>
                                    <Typography>
                                        {formatAmount({
                                            amount: amount.formatted,
                                        })}
                                    </Typography>
                                </div>
                            ))} */}
                    </div>
                );
            })}
        </div>
    );
}

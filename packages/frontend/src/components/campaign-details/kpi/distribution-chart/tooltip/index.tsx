import { formatPercentage, formatTokenAmount } from "@/src/utils/format";
import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { DistributionChartData } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import classNames from "classnames";

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

    const { distributions, from, distributed, reimbursed } = payload[0].payload;

    if (distributions.length === 0) return null;

    return (
        <div className={styles.root}>
            <div className={styles.section}>
                <div className={styles.fieldWrapper}>
                    <Typography weight="medium" light uppercase>
                        {t("distributionTime")}
                    </Typography>
                    <Typography weight="medium" uppercase>
                        {dayjs.unix(from).format("DD MMM HH:mm")}
                    </Typography>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.fieldWrapper}>
                    <Typography weight="medium" light uppercase>
                        {t("distributed")}
                    </Typography>
                    <Typography weight="medium" uppercase>
                        {formatPercentage(distributed * 100)}
                    </Typography>
                </div>
                <div className={styles.fieldWrapper}>
                    <Typography weight="medium" light uppercase>
                        {t("reimbursed")}
                    </Typography>
                    <Typography weight="medium" uppercase>
                        {formatPercentage(reimbursed * 100)}
                    </Typography>
                </div>
            </div>
            <div
                className={classNames(styles.breakdownWrapper, styles.section)}
            >
                <div className={styles.row}>
                    <Typography weight="medium" light uppercase>
                        {t("token")}
                    </Typography>
                    <Typography weight="medium" light uppercase>
                        {t("distributed")}
                    </Typography>
                    <Typography weight="medium" light uppercase>
                        {t("reimbursed")}
                    </Typography>
                </div>
                {distributions.map(({ distributed, reimbursed, token }) => (
                    <div key={token.address} className={styles.row}>
                        <div className={styles.tokenWrapper}>
                            <RemoteLogo address={token.address} chain={chain} />
                            <Typography weight="medium">
                                {token.symbol}
                            </Typography>
                        </div>
                        <Typography weight="medium">
                            {formatTokenAmount({
                                amount: distributed.formatted,
                            })}
                        </Typography>
                        <Typography weight="medium">
                            {formatTokenAmount({
                                amount: reimbursed.formatted,
                            })}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );
}

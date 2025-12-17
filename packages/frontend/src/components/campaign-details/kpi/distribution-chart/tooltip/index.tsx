import { formatPercentage, formatAmount } from "@/src/utils/format";
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

    const { distributions, to, distributed, reimbursed } = payload[0].payload;

    if (distributions.length === 0) return null;

    return (
        <div className={styles.root}>
            <div className={styles.fieldWrapper}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("time")}
                </Typography>
                <Typography size="sm" weight="medium" uppercase>
                    {dayjs.unix(to).format("DD MMM - HH:mm")}
                </Typography>
            </div>
            <div className={styles.fieldWrapper}>
                <div className={styles.textWrapper}>
                    <div
                        className={classNames(
                            styles.legendDot,
                            styles.reimbursed,
                        )}
                    ></div>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("reimbursed")}
                    </Typography>
                </div>
                <div className={styles.percentageChip}>
                    <Typography size="sm" weight="medium" uppercase>
                        {formatPercentage({ percentage: reimbursed * 100 })}
                    </Typography>
                </div>
            </div>
            <div className={styles.fieldWrapper}>
                <div className={styles.textWrapper}>
                    <div
                        className={classNames(
                            styles.legendDot,
                            styles.distributed,
                        )}
                    ></div>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("distributed")}
                    </Typography>
                </div>
                <div className={styles.percentageChip}>
                    <Typography size="sm" weight="medium" uppercase>
                        {formatPercentage({ percentage: distributed * 100 })}
                    </Typography>
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={classNames(styles.header, styles.breakdownWrapper)}>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("token")}
                </Typography>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("distributed")}
                </Typography>
                <Typography
                    size="sm"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("reimbursed")}
                </Typography>
            </div>
            {distributions.map(({ distributed, reimbursed, token }) => (
                <div key={token.address} className={styles.row}>
                    <div className={styles.tokenWrapper}>
                        <RemoteLogo
                            address={token.address}
                            chain={chain}
                            size="xs"
                        />
                        <Typography size="sm" weight="medium">
                            {token.symbol}
                        </Typography>
                    </div>
                    <Typography size="sm" weight="medium">
                        {formatAmount({
                            amount: distributed.formatted,
                            cutoff: false,
                        })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatAmount({
                            amount: reimbursed.formatted,
                            cutoff: false,
                        })}
                    </Typography>
                </div>
            ))}
        </div>
    );
}

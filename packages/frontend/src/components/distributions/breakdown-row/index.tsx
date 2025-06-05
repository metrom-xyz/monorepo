import type { ProcessedDistribution } from "@/src/hooks/useDistributions";
import { RemoteLogo } from "../../remote-logo";
import { type Address, zeroAddress } from "viem";
import { ErrorText, Typography } from "@metrom-xyz/ui";
import {
    formatAmount,
    formatAmountChange,
    formatDateTime,
    formatPercentage,
} from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { getColorFromAddress } from "@/src/utils/address";
import dayjs from "dayjs";
import { useMemo } from "react";

import styles from "./styles.module.css";

interface BreakdownRowProps {
    style?: any;
    index: number;
    active: boolean;
    chainId: number;
    previousDistribution?: ProcessedDistribution;
    distribution: ProcessedDistribution;
    campaignFrom?: number;
}

export function BreakdownRow({
    style,
    index,
    active,
    chainId,
    previousDistribution,
    distribution,
    campaignFrom,
}: BreakdownRowProps) {
    const t = useTranslations("campaignDistributions");

    const notFirstDistribution = useMemo(
        () =>
            !!campaignFrom &&
            dayjs
                .unix(distribution.timestamp)
                .diff(dayjs.unix(campaignFrom), "hours") > 1 &&
            index === 0,
        [campaignFrom, distribution.timestamp, index],
    );

    // there are cases where distributions didn't happen hourly
    const aggregatedDistributions = useMemo(() => {
        if (!previousDistribution) return 0;

        return dayjs
            .unix(distribution.timestamp)
            .diff(dayjs.unix(previousDistribution.timestamp), "hours");
    }, [previousDistribution, distribution.timestamp]);

    return (
        <div
            style={style}
            className={classNames(styles.root, { [styles.active]: active })}
        >
            {Object.entries(distribution.weights).map(([token, weight]) => {
                return (
                    <div key={token} className={styles.tokenColumn}>
                        <div className={styles.titleWrapper}>
                            <RemoteLogo
                                address={token as Address}
                                chain={chainId}
                            />
                            <Typography weight="medium" size="lg">
                                {formatDateTime(distribution.timestamp)}
                            </Typography>
                            {notFirstDistribution && (
                                <ErrorText
                                    level="warning"
                                    size="xs"
                                    weight="medium"
                                >
                                    {t("warningMessages.notFirstDistribution")}
                                </ErrorText>
                            )}
                            {aggregatedDistributions > 1 && (
                                <ErrorText
                                    level="warning"
                                    size="xs"
                                    weight="medium"
                                >
                                    {t("warningMessages.multiDistribution", {
                                        amount: aggregatedDistributions,
                                    })}
                                </ErrorText>
                            )}
                        </div>
                        <div className={styles.header}>
                            <Typography
                                weight="medium"
                                light
                                size="sm"
                                uppercase
                            >
                                {t("account")}
                            </Typography>
                            <Typography
                                weight="medium"
                                light
                                size="sm"
                                uppercase
                            >
                                {t("distributed")}
                            </Typography>
                            <Typography
                                weight="medium"
                                light
                                size="sm"
                                uppercase
                            >
                                {t("weight")}
                            </Typography>
                        </div>
                        <div className={styles.accounts}>
                            {Object.entries(weight)
                                .sort(
                                    (a, b) =>
                                        b[1].percentage.formatted -
                                        a[1].percentage.formatted,
                                )
                                .map(
                                    ([
                                        account,
                                        { amount, amountChange, percentage },
                                    ]) => (
                                        <div
                                            key={account}
                                            className={styles.accountRow}
                                        >
                                            <div className={styles.account}>
                                                <div
                                                    className={styles.legend}
                                                    style={{
                                                        backgroundColor:
                                                            getColorFromAddress(
                                                                account as Address,
                                                            ),
                                                    }}
                                                ></div>
                                                <Typography
                                                    size="sm"
                                                    light
                                                    weight="medium"
                                                >
                                                    {account === zeroAddress
                                                        ? t("reimbursed")
                                                        : account}
                                                </Typography>
                                            </div>
                                            <div className={styles.amount}>
                                                <Typography>
                                                    {formatAmount({
                                                        amount: amount.formatted,
                                                    })}
                                                </Typography>
                                                <Typography
                                                    size="xs"
                                                    className={classNames(
                                                        styles.change,
                                                        {
                                                            [styles.positive]:
                                                                amountChange.formatted >
                                                                0,
                                                            [styles.negative]:
                                                                amountChange.formatted <
                                                                0,
                                                        },
                                                    )}
                                                >
                                                    {formatAmountChange({
                                                        amount: amountChange.formatted,
                                                    })}
                                                </Typography>
                                            </div>
                                            <Typography>
                                                {formatPercentage({
                                                    percentage:
                                                        percentage.formatted,
                                                })}
                                            </Typography>
                                        </div>
                                    ),
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

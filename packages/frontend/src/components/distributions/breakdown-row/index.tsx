import type { ProcessedDistribution } from "@/src/hooks/useDistributions";
import { RemoteLogo } from "../../remote-logo";
import { type Address } from "viem";
import { ErrorText, Skeleton, Typography } from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { AccountRow, AccountRowSkeleton } from "./account-row";

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

    const { address } = useAccount();

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
                                .map(([account, weight]) => (
                                    <AccountRow
                                        key={account}
                                        account={account as Address}
                                        connected={
                                            address?.toLowerCase() ===
                                            account.toLowerCase()
                                        }
                                        {...weight}
                                    />
                                ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function BreakdownRowSkeleton() {
    return (
        <div className={styles.root}>
            <div className={styles.tokenColumn}>
                <div className={styles.titleWrapper}>
                    <RemoteLogo loading />
                    <Skeleton width={150} size="lg" />
                </div>
                <div className={styles.header}>
                    <Skeleton width={100} size="sm" />
                    <Skeleton width={100} size="sm" />
                    <Skeleton width={100} size="sm" />
                </div>
                <div className={styles.accounts}>
                    {Array.from({ length: 17 }).map((_, index) => (
                        <AccountRowSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

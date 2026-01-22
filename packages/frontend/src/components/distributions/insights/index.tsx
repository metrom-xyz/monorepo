import {
    DistributablesType,
    KpiMetric,
    type Campaign,
    type KpiSpecification,
} from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SparklesIcon } from "@/src/assets/sparkles-icon";
import { useMemo } from "react";
import { useRewardsDistributionBreakdown } from "@/src/hooks/useRewardsDistributionBreakdown";
import { DistributedRewardsBreakdown } from "./distributed-rewards-breakdown";
import classNames from "classnames";
import { Distributables } from "./distributables";
import { AverageIncentive } from "./average-incentive";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface InsightsProps {
    campaign: Campaign;
    loading?: boolean;
}

export function Insights({ campaign }: InsightsProps) {
    const t = useTranslations("campaignDistributions.insights");

    const distributingTokens = campaign.isDistributing(
        DistributablesType.Tokens,
    );
    const withKpi = !!campaign.specification?.kpi;

    const { measurement: kpiMeasurementPercentage, minimumPayoutPercentage } =
        useMemo<KpiSpecification>(() => {
            if (!campaign.specification?.kpi)
                return {
                    goal: {
                        metric: KpiMetric.RangePoolTvl,
                        lowerUsdTarget: 0,
                        upperUsdTarget: 0,
                    },
                };

            const { goal, measurement, minimumPayoutPercentage } =
                campaign.specification.kpi;

            return { goal, measurement, minimumPayoutPercentage };
        }, [campaign]);

    const rewardsDistributionBreakdown = useRewardsDistributionBreakdown({
        distributables: distributingTokens
            ? campaign.distributables
            : undefined,
        kpiMeasurementPercentage,
        minimumPayoutPercentage,
    });

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <SparklesIcon className={styles.icon} />
                    <Typography
                        weight="medium"
                        uppercase
                        className={styles.title}
                    >
                        {t("title")}
                    </Typography>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.box}>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("incetivizedAssets")}
                    </Typography>
                    {distributingTokens ? (
                        <Distributables
                            chain={campaign.chainId}
                            distributables={campaign.distributables}
                        />
                    ) : (
                        <Typography weight="medium" className={styles.mainText}>
                            -
                        </Typography>
                    )}
                </div>
                {withKpi && (
                    <div className={styles.boxes}>
                        <div className={styles.box}>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("paid")}
                            </Typography>
                            <DistributedRewardsBreakdown
                                chain={campaign.chainId}
                                totalUsdValue={
                                    rewardsDistributionBreakdown?.distributedUsdValue
                                }
                                percentage={
                                    rewardsDistributionBreakdown?.percentages
                                        .distributed
                                }
                                rewards={
                                    rewardsDistributionBreakdown?.distributedList
                                }
                            />
                        </div>
                        <div
                            className={classNames(
                                styles.box,
                                styles.borderBottom,
                            )}
                        >
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("reimbursed")}
                            </Typography>
                            <DistributedRewardsBreakdown
                                chain={campaign.chainId}
                                totalUsdValue={
                                    rewardsDistributionBreakdown?.reimbursedUsdValue
                                }
                                percentage={
                                    rewardsDistributionBreakdown?.percentages
                                        .reimbursed
                                }
                                rewards={
                                    rewardsDistributionBreakdown?.reimbursedList
                                }
                            />
                        </div>
                    </div>
                )}
                <div className={styles.boxes}>
                    <div className={styles.box}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("addressesParticipated")}
                        </Typography>
                        <Typography weight="medium" className={styles.mainText}>
                            {formatAmount({
                                amount: campaign.accountsIncentivized,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.box}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("averageIncentive")}
                        </Typography>
                        {distributingTokens ? (
                            <AverageIncentive
                                chain={campaign.chainId}
                                distributables={campaign.distributables}
                                accountsIncentivized={
                                    campaign.accountsIncentivized
                                }
                                distributedUsdValue={
                                    rewardsDistributionBreakdown?.distributedUsdValue
                                }
                            />
                        ) : (
                            <Typography
                                weight="medium"
                                className={styles.mainText}
                            >
                                -
                            </Typography>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InsightsSkeleton() {
    const t = useTranslations("campaignDistributions.insights");

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <SparklesIcon className={styles.icon} />
                    <Typography
                        weight="medium"
                        uppercase
                        className={styles.title}
                    >
                        {t("title")}
                    </Typography>
                </div>
            </div>
            <div className={classNames(styles.content, styles.loading)}>
                <div className={classNames(styles.box, styles.loading)}></div>
            </div>
        </div>
    );
}

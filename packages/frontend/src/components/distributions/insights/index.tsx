import {
    CAMPAIGN_TARGET_TO_KIND,
    DistributablesType,
    KpiMetric,
    type Campaign,
    type KpiSpecification,
} from "@metrom-xyz/sdk";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { SparklesIcon } from "@/src/assets/sparkles-icon";
import { useMemo } from "react";
import { useRewardsDistributionBreakdown } from "@/src/hooks/useRewardsDistributionBreakdown";
import { DistributedRewardsBreakdown } from "./distributed-rewards-breakdown";
import { Distributables } from "./distributables";
import { AverageIncentive } from "./average-incentive";
import { formatAmount } from "@/src/utils/format";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";
import { TargetValueChange } from "./target-value-change";
import classNames from "classnames";

import styles from "./styles.module.css";

interface InsightsProps {
    campaign: Campaign;
    loading?: boolean;
}

export function Insights({ campaign }: InsightsProps) {
    const t = useTranslations("campaignDistributions.insights");
    const targetValueName = useCampaignTargetValueName({
        kind: CAMPAIGN_TARGET_TO_KIND[campaign.target.type],
    });

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
                <div className={styles.titleWrapper}>
                    <SparklesIcon className={styles.icon} />
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.title}
                    >
                        {t("title")}
                    </Typography>
                </div>
                <div className={styles.content}>
                    <div className={styles.insight}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t("incetivizedAssets")}
                        </Typography>
                        {distributingTokens ? (
                            <Distributables
                                chain={campaign.chainId}
                                distributables={campaign.distributables}
                            />
                        ) : (
                            <Typography size="sm" weight="medium">
                                -
                            </Typography>
                        )}
                    </div>
                    {withKpi && (
                        <>
                            <div className={styles.divider}></div>
                            <div className={styles.insight}>
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                >
                                    {t("paid")}
                                </Typography>
                                <DistributedRewardsBreakdown
                                    chain={campaign.chainId}
                                    totalUsdValue={
                                        rewardsDistributionBreakdown?.distributedUsdValue
                                    }
                                    percentage={
                                        rewardsDistributionBreakdown
                                            ?.percentages.distributed
                                    }
                                    rewards={
                                        rewardsDistributionBreakdown?.distributedList
                                    }
                                />
                            </div>
                            <div className={styles.insight}>
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                >
                                    {t("reimbursed")}
                                </Typography>
                                <DistributedRewardsBreakdown
                                    chain={campaign.chainId}
                                    totalUsdValue={
                                        rewardsDistributionBreakdown?.reimbursedUsdValue
                                    }
                                    percentage={
                                        rewardsDistributionBreakdown
                                            ?.percentages.reimbursed
                                    }
                                    rewards={
                                        rewardsDistributionBreakdown?.reimbursedList
                                    }
                                />
                            </div>
                        </>
                    )}
                    <div className={styles.divider}></div>
                    <div className={styles.insight}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t("addressesParticipated")}
                        </Typography>
                        <Typography size="sm" weight="medium">
                            {formatAmount({
                                amount: campaign.accountsIncentivized,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.insight}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
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
                            <Typography size="sm" weight="medium">
                                -
                            </Typography>
                        )}
                    </div>
                    {withKpi && (
                        <>
                            <div className={styles.divider}></div>
                            <div className={styles.insight}>
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                >
                                    {t("targetValueChange", {
                                        targetValueName,
                                    })}
                                </Typography>
                                <TargetValueChange campaign={campaign} />
                            </div>
                        </>
                    )}
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
                <div className={styles.titleWrapper}>
                    <SparklesIcon className={styles.icon} />
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.title}
                    >
                        {t("title")}
                    </Typography>
                </div>
                <div className={classNames(styles.content, styles.loading)}>
                    <Skeleton size="sm" width={180} />
                    <Skeleton size="sm" width={130} />
                    <Skeleton size="sm" width={180} />
                    <Skeleton size="sm" width={150} />
                    <Skeleton size="sm" width={150} />
                    <Skeleton size="sm" width={200} />
                </div>
            </div>
        </div>
    );
}

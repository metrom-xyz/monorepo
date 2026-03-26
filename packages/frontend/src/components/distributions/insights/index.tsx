import {
    CAMPAIGN_TARGET_TO_KIND,
    DistributablesType,
    KpiMetric,
    SpecificationDistributionType,
    type KpiDistributionSpecification,
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
import type { CampaignItemDetails } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface InsightsProps {
    campaignItemDetails: CampaignItemDetails;
    loading?: boolean;
}

export function Insights({ campaignItemDetails }: InsightsProps) {
    const t = useTranslations("campaignDistributions.insights");

    const { chainId, accountsIncentivized } = campaignItemDetails;
    const targetValueName = useCampaignTargetValueName({
        kind: CAMPAIGN_TARGET_TO_KIND[campaignItemDetails.target.type],
    });

    const distributingTokens = campaignItemDetails.isDistributing(
        DistributablesType.Tokens,
    );
    const withKpi =
        campaignItemDetails.specification?.distribution?.type ===
        SpecificationDistributionType.Kpi;

    const { measurement: kpiMeasurementPercentage, minimumPayoutPercentage } =
        useMemo<KpiDistributionSpecification>(() => {
            if (
                campaignItemDetails.specification?.distribution?.type !==
                SpecificationDistributionType.Kpi
            )
                return {
                    type: SpecificationDistributionType.Kpi,
                    goal: {
                        metric: KpiMetric.RangePoolTvl,
                        lowerUsdTarget: 0,
                        upperUsdTarget: 0,
                    },
                };

            const { goal, measurement, minimumPayoutPercentage } =
                campaignItemDetails.specification.distribution;

            return {
                type: SpecificationDistributionType.Kpi,
                goal,
                measurement,
                minimumPayoutPercentage,
            };
        }, [campaignItemDetails]);

    const rewardsDistributionBreakdown = useRewardsDistributionBreakdown({
        distributables: distributingTokens
            ? campaignItemDetails.distributables
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
                                chain={chainId}
                                distributables={
                                    campaignItemDetails.distributables
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
                                    {t("paid")}
                                </Typography>
                                <DistributedRewardsBreakdown
                                    chain={chainId}
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
                                    chain={chainId}
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
                                amount: accountsIncentivized,
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
                                chain={chainId}
                                distributables={
                                    campaignItemDetails.distributables
                                }
                                accountsIncentivized={accountsIncentivized}
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
                                <TargetValueChange
                                    campaignItemDetails={campaignItemDetails}
                                />
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

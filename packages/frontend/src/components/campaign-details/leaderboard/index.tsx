import { useDistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import { shortenAddress, type Campaign } from "@metrom-xyz/sdk";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/src/ui/skeleton";
import dayjs from "dayjs";
import numeral from "numeral";
import { PersonalRank } from "./personal-rank";
import { RepartitionChart } from "./repartition-chart";
import type { Address } from "viem";
import { RewardsBreakdown } from "./rewards-breakdown";

import styles from "./styles.module.css";

interface LeaderboardProps {
    campaign?: Campaign;
    loading: boolean;
}

export function Leaderboard({ campaign, loading }: LeaderboardProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const {
        loading: loadingDistributionBreakdown,
        breakdown: distributionBreakdown,
    } = useDistributionBreakdown(campaign);

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography variant="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                <div className={styles.subtitleContainer}>
                    <Typography weight="medium" light uppercase>
                        {t("subtitle")}
                    </Typography>
                    {loading || loadingDistributionBreakdown ? (
                        <Skeleton width={130} />
                    ) : (
                        <Typography
                            weight="medium"
                            light
                            uppercase={!!distributionBreakdown}
                        >
                            {distributionBreakdown
                                ? dayjs
                                      .unix(distributionBreakdown.timestamp)
                                      .format("DD/MMM/YY HH:mm")
                                : t("noDistribution")}
                        </Typography>
                    )}
                </div>
            </div>
            <div className={styles.cardsWrapper}>
                <div className={styles.card}>
                    <PersonalRank
                        chain={campaign?.chainId}
                        loading={loadingDistributionBreakdown}
                        distributionBreakdown={distributionBreakdown}
                    />
                    <div className={styles.tableWrapper}>
                        <div className={styles.header}>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                variant="sm"
                            >
                                {t("rank")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                variant="sm"
                            >
                                {t("account")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                variant="sm"
                            >
                                {t("rewardsDistributed")}
                            </Typography>
                        </div>
                        {loadingDistributionBreakdown ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : distributionBreakdown &&
                          Object.keys(
                              distributionBreakdown.sortedDistributionsByAccount,
                          ).length > 0 ? (
                            Object.entries(
                                distributionBreakdown.sortedDistributionsByAccount,
                            )
                                .slice(0, 5)
                                .map(([account, distribution], i) => (
                                    <div key={account} className={styles.row}>
                                        <div>
                                            <Typography weight="medium" light>
                                                # {i + 1}
                                            </Typography>
                                            <Typography weight="medium">
                                                {numeral(
                                                    distribution.percentage,
                                                ).format("0.[00]a")}
                                                %
                                            </Typography>
                                        </div>
                                        <Typography weight="medium">
                                            {shortenAddress(account as Address)}
                                        </Typography>
                                        <div>
                                            <RewardsBreakdown
                                                chain={campaign?.chainId}
                                                accrued={distribution.accrued}
                                                usdValue={distribution.usdValue}
                                            />
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <Typography weight="medium" light>
                                {t("noRewards")}
                            </Typography>
                        )}
                    </div>
                </div>
                <div className={styles.repartion}>
                    <RepartitionChart
                        loading={loading}
                        distributionBreakdown={distributionBreakdown}
                    />
                </div>
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className={styles.row}>
            <Skeleton width={80} />
            <Skeleton width={120} />
            <Skeleton width={120} />
        </div>
    );
}

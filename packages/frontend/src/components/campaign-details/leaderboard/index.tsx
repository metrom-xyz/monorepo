import { useDistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import { type Campaign, type UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { shortenAddress } from "@/src/utils/address";
import { Typography, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { PersonalRank } from "./personal-rank";
import { RepartitionChart } from "./repartition-chart";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { RewardsBreakdown } from "./rewards-breakdown";
import { formatDateTime, formatPercentage } from "@/src/utils/format";
import { useMemo } from "react";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getAddressExplorerLink } from "@/src/utils/dex";
import classNames from "classnames";
import { NoDistributionsIcon } from "@/src/assets/no-distributions-icon";

import styles from "./styles.module.css";

interface LeaderboardProps {
    campaign?: Campaign;
    loading: boolean;
}

export interface PersonalRank {
    account: Address;
    position: number;
    percentage: number;
    usdValue: number | null;
    accrued: UsdPricedErc20TokenAmount[];
}

export function Leaderboard({ campaign, loading }: LeaderboardProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const { address: connectedAddress } = useAccount();
    const {
        loading: loadingDistributionBreakdown,
        breakdown: distributionBreakdown,
    } = useDistributionBreakdown(campaign);

    const personalRank: PersonalRank | undefined = useMemo(() => {
        if (!connectedAddress || !distributionBreakdown) return undefined;

        const personalRankIndex = Object.keys(
            distributionBreakdown.sortedDistributionsByAccount,
        ).findIndex((account) => account === connectedAddress.toLowerCase());

        return personalRankIndex < 0
            ? undefined
            : {
                  ...distributionBreakdown.sortedDistributionsByAccount[
                      connectedAddress.toLowerCase() as Address
                  ],
                  account: connectedAddress,
                  position: personalRankIndex + 1,
              };
    }, [connectedAddress, distributionBreakdown]);

    if (!loading && !loadingDistributionBreakdown && !distributionBreakdown) {
        return (
            <div className={styles.root}>
                <div className={styles.titleContainer}>
                    <Typography variant="lg" weight="medium" uppercase>
                        {t("title")}
                    </Typography>
                    <div className={styles.subtitleContainer}>
                        <Typography
                            weight="medium"
                            variant="sm"
                            light
                            uppercase
                        >
                            {t("noDistribution")}
                        </Typography>
                    </div>
                </div>
                <Card
                    className={classNames(styles.card, styles.noDistribution)}
                >
                    <NoDistributionsIcon />
                    <Typography uppercase weight="medium" variant="sm">
                        {t("noDistribution")}
                    </Typography>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography variant="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                <div className={styles.subtitleContainer}>
                    <Typography weight="medium" variant="sm" light uppercase>
                        {distributionBreakdown && t("subtitleLatest")}
                    </Typography>
                    {loading || loadingDistributionBreakdown ? (
                        <Skeleton width={130} />
                    ) : (
                        <Typography
                            weight="medium"
                            variant="sm"
                            light
                            uppercase
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
                        loading={loading || loadingDistributionBreakdown}
                        personalRank={personalRank}
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
                        {loading || loadingDistributionBreakdown ? (
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
                                                #{i + 1}
                                            </Typography>
                                            <Typography weight="medium">
                                                {formatPercentage(
                                                    distribution.percentage,
                                                )}
                                            </Typography>
                                        </div>
                                        <div className={styles.accountWrapper}>
                                            <Typography weight="medium">
                                                {shortenAddress(
                                                    account as Address,
                                                )}
                                            </Typography>
                                            <a
                                                href={getAddressExplorerLink(
                                                    account as Address,
                                                    campaign?.chainId,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ArrowRightIcon
                                                    className={
                                                        styles.externalLinkIcon
                                                    }
                                                />
                                            </a>
                                        </div>
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
                        personalRank={personalRank}
                    />
                </div>
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className={styles.row}>
            <Skeleton variant="lg" width={80} />
            <Skeleton variant="lg" width={120} />
            <Skeleton variant="lg" width={120} />
        </div>
    );
}

import { type UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { shortenAddress } from "@/src/utils/address";
import { Typography, Skeleton, Card, type SkeletonProps } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { PersonalRank } from "./personal-rank";
import { RepartitionChart } from "./repartition-chart";
import type { Address, Hex } from "viem";
import { RewardsBreakdown } from "./rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getExplorerLink } from "@/src/utils/dex";
import classNames from "classnames";
import { NoDistributionsIcon } from "@/src/assets/no-distributions-icon";
import { PointsBreakdown } from "./points-breakdown";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Leaderboard } from "@/src/types/campaign";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface LeaderboardProps {
    chainId?: SupportedChain;
    leaderboard?: Leaderboard;
    noDistributionDate?: boolean;
    loading: boolean;
}

export interface PersonalRank {
    account: Address;
    position: number;
    percentage: number;
    usdValue: number | null;
    accrued: UsdPricedErc20TokenAmount[];
}

export function Leaderboard({
    chainId,
    leaderboard,
    noDistributionDate,
    loading,
}: LeaderboardProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const { width } = useWindowSize();

    if (!loading && !leaderboard) {
        return (
            <div className={styles.root}>
                <div className={styles.titleContainer}>
                    <Typography size="lg" weight="medium" uppercase>
                        {t("title")}
                    </Typography>
                    <div className={styles.subtitleContainer}>
                        <Typography weight="medium" size="sm" light uppercase>
                            {t("noDistribution")}
                        </Typography>
                    </div>
                </div>
                <Card className={classNames(styles.noDistribution)}>
                    <NoDistributionsIcon />
                    <Typography uppercase weight="medium" size="sm">
                        {t("noDistribution")}
                    </Typography>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                {!noDistributionDate && (
                    <div className={styles.subtitleContainer}>
                        <Typography weight="medium" size="sm" light uppercase>
                            {leaderboard && t("subtitleLatest")}
                        </Typography>
                        {loading ? (
                            <Skeleton width={130} size="sm" />
                        ) : (
                            <Typography
                                weight="medium"
                                size="sm"
                                light
                                uppercase
                            >
                                {leaderboard && leaderboard.timestamp
                                    ? dayjs
                                          .unix(leaderboard.timestamp)
                                          .format("DD/MMM/YY HH:mm")
                                    : t("noDistribution")}
                            </Typography>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.cardsWrapper}>
                <div className={styles.leaderboardWrapper}>
                    <PersonalRank
                        chain={chainId}
                        loading={loading}
                        connectedAccountRank={leaderboard?.connectedAccountRank}
                    />
                    <Card className={styles.tableWrapper}>
                        <div className={styles.header}>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                size="sm"
                            >
                                {t("rank")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                size="sm"
                            >
                                {t("account")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                light
                                size="sm"
                            >
                                {t("rewardsDistributed")}
                            </Typography>
                        </div>
                        {loading ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : leaderboard &&
                          Object.keys(leaderboard.sortedRanks).length > 0 ? (
                            leaderboard.sortedRanks.map((distribution, i) => (
                                <div
                                    key={distribution.account}
                                    className={styles.row}
                                >
                                    <div>
                                        <Typography weight="medium" light>
                                            #{i + 1}
                                        </Typography>
                                        <Typography weight="medium">
                                            {formatPercentage({
                                                percentage: distribution.weight,
                                            })}
                                        </Typography>
                                    </div>
                                    <div className={styles.accountWrapper}>
                                        <Typography weight="medium">
                                            {shortenAddress(
                                                distribution.account,
                                                width > 640,
                                            )}
                                        </Typography>
                                        {chainId && (
                                            <a
                                                href={getExplorerLink(
                                                    distribution.account,
                                                    chainId,
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
                                        )}
                                    </div>
                                    <div>
                                        {distribution.distributed instanceof
                                        Array ? (
                                            <RewardsBreakdown
                                                chain={chainId}
                                                distributed={
                                                    distribution.distributed
                                                }
                                                usdValue={distribution.usdValue}
                                            />
                                        ) : (
                                            <PointsBreakdown
                                                distributed={
                                                    distribution.distributed
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Typography weight="medium" light>
                                {t("noRewards")}
                            </Typography>
                        )}
                    </Card>
                </div>
                <RepartitionChart
                    loading={loading}
                    leaderboard={leaderboard}
                    connectedAccountRank={leaderboard?.connectedAccountRank}
                />
            </div>
        </div>
    );
}

export function SkeletonRow({
    size = "base",
}: {
    size?: SkeletonProps["size"];
}) {
    return (
        <div className={styles.row}>
            <Skeleton size={size} width={80} />
            <Skeleton size={size} width={120} />
            <Skeleton size={size} width={120} />
        </div>
    );
}

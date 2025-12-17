import {
    ChainType,
    RestrictionType,
    type Restrictions,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { shortenAddress } from "@/src/utils/address";
import {
    Typography,
    Skeleton,
    Card,
    type SkeletonProps,
    Pointer,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { PersonalRank, type PersonalRankProps } from "./personal-rank";
import {
    EmptyRepartitionChart,
    RepartitionChart,
    type RepartitionChartProps,
} from "./repartition-chart";
import type { Address } from "viem";
import { RewardsBreakdown } from "./rewards-breakdown";
import { formatPercentage } from "@/src/utils/format";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getExplorerLink } from "@/src/utils/explorer";
import { PointsBreakdown } from "./points-breakdown";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Leaderboard } from "@/src/types/campaign";
import { useWindowSize } from "react-use";
import { EmptyIcon } from "@/src/assets/empty-icon";
import { useAccount } from "@/src/hooks/useAccount";
import classNames from "classnames";

import styles from "./styles.module.css";

interface LeaderboardProps {
    chainId?: SupportedChain;
    chainType?: ChainType;
    restrictions?: Restrictions;
    leaderboard?: Leaderboard;
    noDistributionDate?: boolean;
    loading: boolean;
    messages?: {
        personalRank?: PersonalRankProps["messages"];
        repartionChart?: RepartitionChartProps["messages"];
    };
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
    chainType,
    restrictions,
    leaderboard,
    noDistributionDate,
    loading,
    messages,
}: LeaderboardProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const { address: connectedAddress } = useAccount();
    const { width } = useWindowSize();

    const whitelist = restrictions?.type === RestrictionType.Whitelist;

    if (!loading && !leaderboard) {
        return (
            <div className={styles.root}>
                <div className={styles.titleContainer}>
                    <Typography weight="medium" uppercase>
                        {t("title")}
                    </Typography>
                    <div className={styles.subtitleContainer}>
                        <Typography
                            weight="medium"
                            size="sm"
                            variant="tertiary"
                        >
                            {t("noDistribution")}
                        </Typography>
                    </div>
                </div>
                <div className={styles.cardsWrapper}>
                    <div className={styles.leaderboardWrapper}>
                        <Card className={styles.noDistribution}>
                            <EmptyIcon />
                            <Typography uppercase weight="medium" size="sm">
                                {t("noDistribution")}
                            </Typography>
                        </Card>
                    </div>
                    <EmptyRepartitionChart />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography weight="medium" uppercase>
                    {t("title")}
                </Typography>
                {!noDistributionDate && (
                    <div className={styles.subtitleContainer}>
                        <Typography
                            weight="medium"
                            size="sm"
                            variant="tertiary"
                        >
                            {leaderboard && t("subtitleLatest")}
                        </Typography>
                        {loading ? (
                            <Skeleton width={130} size="sm" />
                        ) : (
                            <Typography
                                weight="medium"
                                size="sm"
                                variant="tertiary"
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
                    <Card className={styles.tableWrapper}>
                        <div className={styles.header}>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
                                size="sm"
                            >
                                {t("rank")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
                                size="sm"
                            >
                                {t("account")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                variant="tertiary"
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
                            leaderboard.sortedRanks.map(
                                (
                                    { account, distributed, weight, usdValue },
                                    i,
                                ) => {
                                    const connected =
                                        account.toLowerCase() ===
                                        connectedAddress?.toLowerCase();

                                    return (
                                        <div
                                            key={account}
                                            className={classNames(styles.row, {
                                                [styles.connected]: connected,
                                            })}
                                        >
                                            <div>
                                                <Typography
                                                    weight="medium"
                                                    variant="tertiary"
                                                >
                                                    # {i + 1}
                                                </Typography>
                                                <Typography weight="medium">
                                                    {formatPercentage({
                                                        percentage: weight,
                                                    })}
                                                </Typography>
                                                {connected && width > 640 && (
                                                    <Pointer
                                                        size="sm"
                                                        uppercase
                                                        color={
                                                            whitelist
                                                                ? "green"
                                                                : "blue"
                                                        }
                                                        text={t("you")}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    styles.accountWrapper
                                                }
                                            >
                                                <Typography weight="medium">
                                                    {shortenAddress(
                                                        account,
                                                        width > 640,
                                                    )}
                                                </Typography>
                                                {chainId && (
                                                    <a
                                                        href={getExplorerLink(
                                                            account,
                                                            chainId,
                                                            chainType,
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
                                                {distributed instanceof
                                                Array ? (
                                                    <RewardsBreakdown
                                                        chain={chainId}
                                                        distributed={
                                                            distributed
                                                        }
                                                        usdValue={usdValue}
                                                    />
                                                ) : (
                                                    <PointsBreakdown
                                                        distributed={
                                                            distributed
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )
                        ) : (
                            <Typography weight="medium" variant="tertiary">
                                {t("noRewards")}
                            </Typography>
                        )}
                        <PersonalRank
                            chain={chainId}
                            loading={loading}
                            restrictions={restrictions}
                            connectedAccountRank={
                                leaderboard?.connectedAccountRank
                            }
                            messages={messages?.personalRank}
                        />
                    </Card>
                </div>
                <RepartitionChart
                    loading={loading}
                    leaderboard={leaderboard}
                    connectedAccountRank={leaderboard?.connectedAccountRank}
                    messages={messages?.repartionChart}
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
            <Skeleton size={size} width={80} className={styles.skeleton} />
            <Skeleton size={size} width={120} className={styles.skeleton} />
            <Skeleton size={size} width={120} className={styles.skeleton} />
        </div>
    );
}

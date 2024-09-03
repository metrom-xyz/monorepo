import { useDistributionData } from "@/src/hooks/useDistributionData";
import { shortenAddress, type Campaign } from "@metrom-xyz/sdk";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/src/ui/skeleton";
import dayjs from "dayjs";
import numeral from "numeral";
import { PersonalRank } from "./personal-rank";
import { RepartitionChart } from "./repartition-chart";

import styles from "./styles.module.css";

interface LeaderboardProps {
    campaign?: Campaign;
    loading: boolean;
}

export function Leaderboard({ campaign, loading }: LeaderboardProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const {
        loadingData: loadingDistributionData,
        loadingEvent: fetchingLastDistribution,
        distributionData,
        lastDistribution,
    } = useDistributionData(campaign);

    const loadingRanks = loading || loadingDistributionData;

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
                    {loading || fetchingLastDistribution ? (
                        <Skeleton width={130} />
                    ) : (
                        <Typography
                            weight="medium"
                            light
                            uppercase={!!lastDistribution}
                        >
                            {lastDistribution
                                ? dayjs
                                      .unix(lastDistribution.timestamp)
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
                        loading={loadingRanks}
                        distributionData={distributionData}
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
                                {t("address")}
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
                        {loadingRanks ? (
                            <>
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                                <SkeletonRow />
                            </>
                        ) : distributionData && distributionData.length > 0 ? (
                            distributionData.slice(0, 5).map((data) => (
                                <div key={data.account} className={styles.row}>
                                    <div>
                                        <Typography weight="medium" light>
                                            # {data.position}
                                        </Typography>
                                        <Typography weight="medium">
                                            {numeral(data.rank).format(
                                                "0.[00]a",
                                            )}
                                            %
                                        </Typography>
                                    </div>
                                    <Typography weight="medium">
                                        {shortenAddress(data.account)}
                                    </Typography>
                                    <div>
                                        <Typography weight="medium">
                                            {numeral(data.amount).format(
                                                "(0.0[0] a)",
                                            )}
                                        </Typography>
                                        <Typography weight="medium" light>
                                            {data.usdValue
                                                ? numeral(data.usdValue).format(
                                                      "($ 0.00 a)",
                                                  )
                                                : "-"}
                                        </Typography>
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
                        repartitionData={distributionData}
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

import { useTranslations } from "next-intl";
import { Skeleton } from "@metrom-xyz/ui/server";
import { LoadingPersonalRank } from "./personal-rank/loading";
import { LoadingRepartitionChart } from "./repartition-chart/loading";

import styles from "./styles.module.css";

export function LoadingLeaderboard() {
    const t = useTranslations("campaignDetails.leaderboard");

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <p className={styles.loadingTitle}>{t("title")}</p>
                <Skeleton width={130} />
            </div>
            <div className={styles.cardsWrapper}>
                <div className={styles.card}>
                    <LoadingPersonalRank />
                    <div className={styles.tableWrapper}>
                        <div className={styles.header}>
                            <p className={styles.loadingTableHeader}>
                                {t("rank")}
                            </p>
                            <p className={styles.loadingTableHeader}>
                                {t("account")}
                            </p>
                            <p className={styles.loadingTableHeader}>
                                {t("rewardsDistributed")}
                            </p>
                        </div>
                        <LoadingLeaderboardRow />
                        <LoadingLeaderboardRow />
                        <LoadingLeaderboardRow />
                        <LoadingLeaderboardRow />
                    </div>
                </div>
                <div className={styles.repartion}>
                    <LoadingRepartitionChart />
                </div>
            </div>
        </div>
    );
}

export function LoadingLeaderboardRow() {
    return (
        <div className={styles.row}>
            <Skeleton width={80} />
            <Skeleton width={120} />
            <Skeleton width={120} />
        </div>
    );
}

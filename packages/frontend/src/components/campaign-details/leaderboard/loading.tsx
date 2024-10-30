import { useTranslations } from "next-intl";
import { Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

export function LoadingLeaderboard() {
    const t = useTranslations("campaignDetails.leaderboard");

    return (
        <div className={styles.root}>
            <p className={styles.loadingTitle}>{t("title")}</p>
            <div className={styles.cardsWrapper}>
                <Skeleton className={styles.loadingCard} />
                <Skeleton className={styles.loadingCard} />
            </div>
        </div>
    );
}

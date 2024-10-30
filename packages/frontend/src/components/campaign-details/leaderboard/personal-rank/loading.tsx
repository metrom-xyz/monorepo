import { useTranslations } from "next-intl";
import { LoadingLeaderboardRow } from "../loading";

import styles from "./styles.module.css";

export function LoadingPersonalRank() {
    const t = useTranslations("campaignDetails.leaderboard.personalRank");

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <p className={styles.loadingTableHeader}>{t("yourRank")}</p>
                <p className={styles.loadingTableHeader}>{t("account")}</p>
                <p className={styles.loadingTableHeader}>
                    {t("rewardsDistributed")}
                </p>
            </div>
            <LoadingLeaderboardRow />
        </div>
    );
}

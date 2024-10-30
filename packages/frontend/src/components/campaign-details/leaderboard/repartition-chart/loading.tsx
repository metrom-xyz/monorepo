import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function LoadingRepartitionChart() {
    const t = useTranslations("campaignDetails.leaderboard");

    return (
        <div className={styles.root}>
            <p className={styles.loadingTitle}>{t("repartition")}</p>
            <div className={styles.chartWrapper}>
                <div className={styles.chartWrapperLoading}></div>
            </div>
        </div>
    );
}

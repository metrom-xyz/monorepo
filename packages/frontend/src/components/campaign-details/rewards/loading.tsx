import { useTranslations } from "next-intl";
import { LoadingTextField, Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

export function LoadingRewards() {
    const t = useTranslations("campaignDetails.rewards");

    return (
        <div className={styles.root}>
            <p className={styles.loadingTitle}>{t("title")}</p>
            <div className={styles.table}>
                <div className={styles.header}>
                    <p className={styles.loadingTableHeader}>{t("token")}</p>
                    <p className={styles.loadingTableHeader}>{t("inUsd")}</p>
                    <p className={styles.loadingTableHeader}>{t("amount")}</p>
                </div>
                <div className={styles.row}>
                    <div className={styles.nameContainer}>
                        <Skeleton circular width={28} />
                        <Skeleton variant="lg" width={80} />
                    </div>
                    <Skeleton width={80} />
                    <Skeleton variant="lg" width={80} />
                </div>
                <div className={styles.summary}>
                    <LoadingTextField
                        boxed
                        variant="xl"
                        label={t("daily")}
                        className={styles.summaryBox}
                    />
                    <LoadingTextField
                        boxed
                        variant="xl"
                        label={t("total")}
                        className={styles.summaryBox}
                    />
                </div>
            </div>
        </div>
    );
}

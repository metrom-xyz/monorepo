import { useTranslations } from "next-intl";
import { Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

export function LoadingRewards() {
    const t = useTranslations("campaignDetails.rewards");

    return (
        <div className={styles.root}>
            <p className={styles.loadingTitle}>{t("title")}</p>
            <Skeleton className={styles.loadingTable}></Skeleton>
        </div>
    );
}

import { useTranslations } from "next-intl";
import { LoadingStep } from "../../step/loading";

import styles from "./styles.module.css";

export function LoadingCreateCampaignForm() {
    const t = useTranslations("newCampaign.form");

    return (
        <div className={styles.root}>
            <LoadingStep label={t("dex.title")} />
            <LoadingStep label={t("pool.title")} />
            <LoadingStep label={t("startDate.title")} />
            <LoadingStep label={t("endDate.title")} />
            <LoadingStep label={t("rewards.title.rewards")} />
            <LoadingStep label={t("kpi.title")} />
            <LoadingStep label={t("restrictions.title")} />
        </div>
    );
}

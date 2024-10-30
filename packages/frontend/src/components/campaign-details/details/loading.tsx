import { LoadingTextField } from "@metrom-xyz/ui/server";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function LoadingDetails() {
    const t = useTranslations("campaignDetails.details");

    return (
        <div className={styles.root}>
            <div>
                <LoadingTextField boxed variant="xl" label={t("tvl")} />
                <LoadingTextField boxed variant="xl" label={t("status.text")} />
            </div>
            <div>
                <LoadingTextField boxed variant="xl" label={t("startDate")} />
                <LoadingTextField boxed variant="xl" label={t("endDate")} />
                <LoadingTextField
                    boxed
                    variant="xl"
                    label={t("status.duration")}
                />
            </div>
        </div>
    );
}

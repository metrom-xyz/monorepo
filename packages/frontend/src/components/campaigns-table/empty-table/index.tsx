import { NoCampaignsIcon } from "@/src/assets/no-campaigns-icon";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function EmptyTable() {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <NoCampaignsIcon />
            <div className={styles.textWrapper}>
                <Typography uppercase weight="medium" size="sm">
                    {t("empty.title")}
                </Typography>
                <Typography size="sm" variant="tertiary">
                    {t("empty.description")}
                </Typography>
            </div>
        </div>
    );
}

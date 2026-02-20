import { useTranslations } from "next-intl";
import { InfoIcon } from "@/src/assets/info-icon";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export function ListFooter() {
    const t = useTranslations("newCampaign.inputs");

    return (
        <div className={styles.root}>
            <InfoIcon className={styles.icon} />
            <Typography size="xs" weight="medium" className={styles.text}>
                {t("listPool")}
            </Typography>
        </div>
    );
}

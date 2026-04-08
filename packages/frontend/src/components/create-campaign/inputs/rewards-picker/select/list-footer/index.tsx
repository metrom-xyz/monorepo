import { useTranslations } from "next-intl";
import { InfoIcon } from "@/src/assets/info-icon";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export function ListFooter() {
    const t = useTranslations("newCampaign.inputs.rewardsPicker");

    return (
        <div className={styles.root}>
            <InfoIcon className={styles.icon} />
            <Typography size="xs" weight="medium" className={styles.text}>
                {t("noToken")}{" "}
                <a
                    href="https://github.com/metrom-xyz/monorepo/issues/new?template=whitelist_token.yaml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    {t("requestIt")}
                    <ArrowRightIcon className={styles.arrowIcon} />
                </a>
            </Typography>
        </div>
    );
}

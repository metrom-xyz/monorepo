import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { Dayjs } from "dayjs";
import { formatDateTime } from "@/src/utils/format";
import dayjs from "dayjs";

import styles from "./styles.module.css";

interface DurationProps {
    startDate?: Dayjs;
    endDate?: Dayjs;
}

export function Duration({ startDate, endDate }: DurationProps) {
    const t = useTranslations("newCampaign.formPreview");

    if (!startDate || !endDate) return null;

    return (
        <div className={styles.root}>
            <Typography size="xs" weight="medium" variant="tertiary">
                {t("duration", {
                    duration: dayjs(startDate.toDate()).to(endDate, true),
                })}
            </Typography>
            <div className={styles.duration}>
                <div className={styles.row}>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {t("from")}
                    </Typography>
                    <Typography size="sm" weight="medium">
                        {formatDateTime(startDate)}
                    </Typography>
                </div>
                <div className={styles.row}>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {t("to")}
                    </Typography>
                    <Typography size="sm" weight="medium">
                        {formatDateTime(endDate)}
                    </Typography>
                </div>
            </div>
        </div>
    );
}

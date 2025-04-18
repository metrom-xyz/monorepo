import { TextField } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/src/utils/format";

import styles from "./styles.module.css";

interface CampaignDurationProps {
    from?: number;
    to?: number;
}

export function CampaignDuration({ from, to }: CampaignDurationProps) {
    const t = useTranslations("campaignDuration");

    const duration = useMemo(() => {
        if (!from || !to) return undefined;

        if (dayjs.unix(from).isAfter(dayjs())) {
            return {
                text: t("status.upcoming.text"),
                duration: t("status.upcoming.duration", {
                    days: dayjs.unix(from).to(dayjs(), true),
                }),
            };
        }
        if (dayjs.unix(to).isBefore(dayjs())) {
            return {
                text: t("status.ended.text"),
                duration: t("status.ended.duration", {
                    days: dayjs().to(dayjs.unix(to), true),
                }),
            };
        }

        return {
            text: t("status.live.text"),
            duration: t("status.live.duration", {
                days: dayjs().to(dayjs.unix(to), true),
            }),
        };
    }, [from, to, t]);

    return (
        <div className={styles.root}>
            <TextField
                boxed
                size="xl"
                uppercase
                label={t("startDate")}
                loading={!duration}
                value={formatDateTime(from)}
            />
            <TextField
                boxed
                size="xl"
                uppercase
                label={t("endDate")}
                loading={!duration}
                value={formatDateTime(to)}
            />
            <TextField
                boxed
                size="xl"
                label={duration?.text || t("status.duration")}
                loading={!duration}
                value={duration?.duration || "-"}
            />
        </div>
    );
}

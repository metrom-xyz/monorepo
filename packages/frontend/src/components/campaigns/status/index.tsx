"use client";

import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import dayjs from "dayjs";
import classNames from "@/src/utils/classes";
import { useTranslations } from "next-intl";

interface CampaignStatusProps {
    from: number;
    to: number;
}

enum StatusState {
    Live,
    Upcoming,
    Ended,
}

export function Status({ from: rawFrom, to: rawTo }: CampaignStatusProps) {
    const t = useTranslations();
    const now = dayjs();
    const from = dayjs.unix(rawFrom);
    const to = dayjs.unix(rawTo);

    let status;
    let text;
    let duration;
    if (now.isBefore(from)) {
        status = StatusState.Upcoming;
        text = t("allCampaigns.status.upcoming.text");
        duration = t("allCampaigns.status.upcoming.duration", {
            days: from.diff(now, "days", false),
        });
    } else if (now.isAfter(to)) {
        status = StatusState.Ended;
        text = t("allCampaigns.status.ended.text");
        duration = t("allCampaigns.status.ended.duration", {
            days: now.diff(to, "days", false),
        });
    } else {
        status = StatusState.Live;
        text = t("allCampaigns.status.live.text");
        duration = t("allCampaigns.status.live.duration", {
            days: from.diff(now, "days", false),
        });
    }

    return (
        <div className={styles.statusRoot}>
            <div
                className={classNames(styles.statusDot, {
                    [styles.statusDotLive]: status === StatusState.Live,
                    [styles.statusDotUpcoming]: status === StatusState.Upcoming,
                    [styles.statusDotEnded]: status === StatusState.Ended,
                })}
            />
            <div className={styles.statusText}>
                <Typography variant="sm" weight="medium">
                    {text}
                </Typography>
                <Typography variant="xs" light>
                    {duration}
                </Typography>
            </div>
        </div>
    );
}

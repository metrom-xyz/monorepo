"use client";

import { Typography } from "@/src/ui/typography";
import dayjs from "dayjs";
import classNames from "@/src/utils/classes";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

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
    const t = useTranslations("allCampaigns.status");
    const now = dayjs();
    const from = dayjs.unix(rawFrom);
    const to = dayjs.unix(rawTo);

    let status;
    let text;
    let duration;
    if (now.isBefore(from)) {
        status = StatusState.Upcoming;
        text = t("upcoming.text");
        duration = t("upcoming.duration", { days: from.to(now, true) });
    } else if (now.isAfter(to)) {
        status = StatusState.Ended;
        text = t("ended.text");
        duration = t("ended.duration", { days: now.to(to, true) });
    } else {
        status = StatusState.Live;
        text = t("live.text");
        duration = t("live.duration", { days: from.to(now, true) });
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

export function SkeletonStatus() {
    return (
        <div className={styles.statusRoot}>
            <Skeleton className={styles.statusDot} />
            <div className={styles.statusText}>
                <Typography variant="sm" weight="medium">
                    <Skeleton width={50} />
                </Typography>
                <Typography variant="xs" light>
                    <Skeleton width={30} />
                </Typography>
            </div>
        </div>
    );
}

"use client";

import { Typography } from "@/src/ui/typography";
import dayjs from "dayjs";
import classNames from "@/src/utils/classes";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/src/ui/skeleton";
import { Status as StatusState } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface CampaignStatusProps {
    from: number;
    to: number;
    status: StatusState;
}

export function Status({
    from: rawFrom,
    to: rawTo,
    status,
}: CampaignStatusProps) {
    const t = useTranslations("allCampaigns.status");
    const now = dayjs();
    const from = dayjs.unix(rawFrom);
    const to = dayjs.unix(rawTo);

    let text;
    let duration;
    if (status === StatusState.Upcoming) {
        text = t("upcoming.text");
        duration = t("upcoming.duration", { days: from.to(now, true) });
    } else if (status === StatusState.Ended) {
        text = t("ended.text");
        duration = t("ended.duration", { days: now.to(to, true) });
    } else {
        text = t("live.text");
        duration = t("live.duration", { days: now.to(to, true) });
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

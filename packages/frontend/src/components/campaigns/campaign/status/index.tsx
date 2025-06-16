"use client";

import { Typography, Skeleton } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { Status as StatusState } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface CampaignStatusProps {
    from: number;
    to: number;
    status: StatusState;
    showDuration?: boolean;
}

export function Status({
    from: rawFrom,
    to: rawTo,
    status,
    showDuration = true,
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
                <Typography size="sm" weight="medium">
                    {text}
                </Typography>
                {showDuration && (
                    <Typography
                        className={styles.statusDuration}
                        light
                        size="sm"
                        weight="medium"
                    >
                        {duration}
                    </Typography>
                )}
            </div>
        </div>
    );
}

export function SkeletonStatus() {
    return (
        <div className={styles.statusRoot}>
            <Skeleton width={8} circular />
            <div className={styles.statusText}>
                <Skeleton width={50} />
                <Skeleton width={30} className={styles.statusDuration} />
            </div>
        </div>
    );
}

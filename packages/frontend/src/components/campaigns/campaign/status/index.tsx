"use client";

import { Typography, Skeleton } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Status as StatusState } from "@metrom-xyz/sdk";
import { CampaignStatusDot } from "@/src/components/campaign-status-dot";

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
    showDuration = false,
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
    } else if (status === StatusState.Expired) {
        text = t("ended.text");
        duration = t("ended.duration", { days: now.to(to, true) });
    } else {
        text = t("live.text");
        duration = t("live.duration", { days: now.to(to, true) });
    }

    return (
        <div className={styles.root}>
            <CampaignStatusDot status={status} />
            <div className={styles.text}>
                <Typography size="sm" weight="medium">
                    {text}
                </Typography>
                {showDuration && status !== StatusState.Expired && (
                    <Typography
                        className={styles.duration}
                        variant="tertiary"
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
        <div className={styles.root}>
            <Skeleton width={12} circular />
            <div className={styles.text}>
                <Skeleton width={40} size="sm" />
                <Skeleton width={90} size="sm" className={styles.duration} />
            </div>
        </div>
    );
}

"use client";

import { Typography } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { Status as StatusState } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

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
        <div className={classNames(styles.root, commonStyles.chip)}>
            <div className={styles.dotWrapper}>
                <div
                    className={classNames(styles.dot, {
                        [styles.dotLive]: status === StatusState.Live,
                        [styles.dotUpcoming]: status === StatusState.Upcoming,
                        [styles.dotEnded]: status === StatusState.Ended,
                    })}
                />
            </div>
            <div className={styles.text}>
                <Typography size="xs" uppercase>
                    {text}
                </Typography>
                {showDuration && (
                    <Typography className={styles.duration} light size="xs">
                        {duration}
                    </Typography>
                )}
            </div>
        </div>
    );
}

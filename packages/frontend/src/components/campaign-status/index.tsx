import { Status as StatusState } from "@metrom-xyz/sdk";
import { CampaignStatusDot } from "../campaign-status-dot";
import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignStatusProps {
    from: number;
    to: number;
    status: StatusState;
    tag?: boolean;
    variant?: "long" | "short";
    size?: TypographySize;
    hideDuration?: boolean;
}

export function CampaignStatus({
    from,
    to,
    status,
    tag = false,
    variant = "long",
    size = "sm",
    hideDuration = false,
}: CampaignStatusProps) {
    const t = useTranslations("campaignStatus");

    const now = dayjs();
    let duration;
    if (status === StatusState.Upcoming)
        duration = dayjs.unix(from).to(now, true);
    else duration = now.to(dayjs.unix(to), true);

    return (
        <div
            className={classNames(styles.root, {
                [styles[status]]: true,
                [styles.tag]: tag,
            })}
        >
            <div className={styles.status}>
                <CampaignStatusDot status={status} />
                {(status !== StatusState.Active || variant === "long") && (
                    <Typography
                        weight="medium"
                        size={size}
                        className={classNames(styles.text, {
                            [styles[status]]: true,
                        })}
                    >
                        {t(`status.${status}`)}
                    </Typography>
                )}
            </div>
            {!hideDuration && status !== StatusState.Expired && (
                <Typography size="sm" weight="medium">
                    {t(`timeSuffix.${status}`, { time: duration })}
                </Typography>
            )}
        </div>
    );
}

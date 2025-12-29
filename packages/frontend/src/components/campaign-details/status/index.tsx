import { Status as StatusState } from "@metrom-xyz/sdk";
import { CampaignStatusDot } from "../../campaign-status-dot";
import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import classNames from "classnames";

import styles from "./styles.module.css";

interface StatusProps {
    from: number;
    to: number;
    status: StatusState;
    size?: TypographySize;
}

export function Status({ from, to, status, size = "xs" }: StatusProps) {
    const t = useTranslations("campaignDetails.header.status");

    const now = dayjs();
    let duration;
    if (status === StatusState.Upcoming)
        duration = dayjs.unix(from).to(now, true);
    else duration = now.to(dayjs.unix(to), true);

    return (
        <div className={classNames(styles.root, { [styles[status]]: true })}>
            <CampaignStatusDot status={status} />
            <Typography weight="medium" size={size}>
                {t(status, { days: duration })}
            </Typography>
        </div>
    );
}

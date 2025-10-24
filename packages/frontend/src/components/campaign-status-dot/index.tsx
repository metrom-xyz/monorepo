import { Status } from "@metrom-xyz/sdk";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignStatusDotProps {
    status?: Status;
}

export function CampaignStatusDot({ status }: CampaignStatusDotProps) {
    return (
        <div
            className={classNames(styles.root, {
                [styles.active]: status === Status.Active,
            })}
        >
            <span
                className={classNames(styles.dot, {
                    [styles.active]: status === Status.Active,
                    [styles.upcoming]: status === Status.Upcoming,
                    [styles.expired]: status === Status.Expired,
                })}
            />
        </div>
    );
}

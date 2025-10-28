import { Status } from "@metrom-xyz/sdk";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignStatusDotProps {
    status?: Status;
    className?: string;
}

export function CampaignStatusDot({
    status,
    className,
}: CampaignStatusDotProps) {
    return (
        <div
            className={classNames("root", styles.root, className, {
                [styles.active]: status === Status.Active,
            })}
        >
            <span
                className={classNames("dot", styles.dot, {
                    [styles.active]: status === Status.Active,
                    [styles.upcoming]: status === Status.Upcoming,
                    [styles.expired]: status === Status.Expired,
                })}
            />
        </div>
    );
}

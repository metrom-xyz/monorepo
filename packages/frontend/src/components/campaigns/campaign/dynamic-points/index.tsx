import { Status } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { PointsIcon } from "@/src/assets/points-icon";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface DynamicPointsProps {
    status: Status;
    dailyPer1k?: number;
}

export function DynamicPoints({ status, dailyPer1k }: DynamicPointsProps) {
    return (
        <div className={styles.root}>
            <div className={styles.iconWrapper}>
                <PointsIcon className={styles.icon} />
            </div>
            <Typography weight="medium" className={styles.textPoints}>
                {status === Status.Expired
                    ? "-"
                    : formatAmount({ amount: dailyPer1k })}
            </Typography>
        </div>
    );
}

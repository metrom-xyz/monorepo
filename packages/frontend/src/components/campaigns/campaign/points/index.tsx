import { Status } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface PointsProps {
    status: Status;
    dailyPer1k?: number;
}

export function Points({ status, dailyPer1k }: PointsProps) {
    return (
        <div className={styles.root}>
            <Typography weight="medium" className={styles.textPoints}>
                {status === Status.Expired
                    ? "-"
                    : formatAmount({ amount: dailyPer1k })}
            </Typography>
        </div>
    );
}

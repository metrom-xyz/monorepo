import { Typography } from "@metrom-xyz/ui";
import type { OnChainAmount } from "@metrom-xyz/sdk";
import { formatTokenAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface PointsBreakdownProps {
    distributed: OnChainAmount;
}

export function PointsBreakdown({ distributed }: PointsBreakdownProps) {
    return (
        <div className={styles.rankWrapper}>
            <Typography weight="medium" light>
                {formatTokenAmount({ amount: distributed.formatted })}
            </Typography>
        </div>
    );
}

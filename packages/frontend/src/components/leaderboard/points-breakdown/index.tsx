import { Typography } from "@metrom-xyz/ui";
import type { OnChainAmount } from "@metrom-xyz/sdk";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface PointsBreakdownProps {
    distributed: OnChainAmount | number;
}

export function PointsBreakdown({ distributed }: PointsBreakdownProps) {
    return (
        <div className={styles.rankWrapper}>
            <Typography weight="medium" light>
                {formatAmount({
                    amount:
                        typeof distributed === "number"
                            ? distributed
                            : distributed.formatted,
                    cutoff: false,
                })}
            </Typography>
        </div>
    );
}

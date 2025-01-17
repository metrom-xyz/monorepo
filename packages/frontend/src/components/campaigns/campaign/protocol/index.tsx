import { Skeleton } from "@metrom-xyz/ui";
import { TargetType, type Campaign } from "@metrom-xyz/sdk";
import { Dex } from "./dex";

import styles from "./styles.module.css";

interface ProtocolProps {
    campaign: Campaign;
}

export function Protocol({ campaign }: ProtocolProps) {
    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <Dex campaign={campaign} />
            )}
        </div>
    );
}

export function SkeletonProtocol() {
    return (
        <div className={styles.root}>
            <Skeleton circular className={styles.icon} />
        </div>
    );
}

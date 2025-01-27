import { Skeleton } from "@metrom-xyz/ui";
import { TargetType, type Campaign } from "@metrom-xyz/sdk";
import { Dex } from "./dex";
import { Brand } from "./brand";

import styles from "./styles.module.css";

interface ProtocolProps {
    campaign: Campaign;
}

// TODO: have a single component for brand and dex since the logic is the same
export function Protocol({ campaign }: ProtocolProps) {
    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <Dex campaign={campaign} />
            )}
            {campaign.isTargeting(TargetType.LiquityV2Debt) && (
                <Brand campaign={campaign} />
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

import { Skeleton } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { Dex } from "./dex";
import { Brand } from "./brand";
import type { NamedCampaign } from "@/src/types";

import styles from "./styles.module.css";

interface ProtocolProps {
    campaign: NamedCampaign;
}

// TODO: have a single component for brand and dex since the logic is the same
export function Protocol({ campaign }: ProtocolProps) {
    const liquityV2Action =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2Collateral) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <Dex campaign={campaign} />
            )}
            {liquityV2Action && <Brand campaign={campaign} />}
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

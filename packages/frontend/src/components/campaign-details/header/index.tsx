import { Skeleton, Button } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { Campaign } from "@/src/types/campaign";
import { AmmPoolLiquityHeader } from "./amm-pool-liquitidy";
import { TargetType } from "@metrom-xyz/sdk";
import { LiquityV2Header } from "./liquity-v2";

import styles from "./styles.module.css";

interface HeaderProps {
    campaign: Campaign;
}

export function Header({ campaign }: HeaderProps) {
    const liquityV2Action =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <AmmPoolLiquityHeader campaign={campaign} />
            )}
            {liquityV2Action && <LiquityV2Header campaign={campaign} />}
        </div>
    );
}

export function SkeletonHeader() {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <PoolRemoteLogo
                        tokens={[{ address: "0x1" }, { address: "0x2" }]}
                        loading
                        size="xl"
                    />
                    <Skeleton size="xl4" width={400} />
                    <Skeleton size="lg" width={60} />
                </div>
                <div className={styles.chips}>
                    <Skeleton
                        size="xl2"
                        width={125}
                        className={styles.skeletonChip}
                    />
                    <Skeleton
                        size="xl2"
                        width={125}
                        className={styles.skeletonChip}
                    />
                </div>
                <Skeleton size="sm" width={125} />
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    <Button size="sm" loading></Button>
                    <Button size="sm" loading></Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        border={false}
                        loading
                    ></Button>
                </div>
            </div>
        </div>
    );
}

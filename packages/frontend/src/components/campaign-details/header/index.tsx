import { Skeleton, Button } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { Campaign } from "@/src/types/campaign";
import { AmmPoolLiquityHeader } from "./amm-pool-liquitidy";
import { TargetType } from "@metrom-xyz/sdk";
import { LiquityV2Header } from "./liquity-v2";
import { AaveV3Header } from "./aave-v3";
import { EmptyHeader } from "./empty";

import styles from "./styles.module.css";

interface HeaderProps {
    campaign: Campaign;
}

export function Header({ campaign }: HeaderProps) {
    const ammPoolLiquidity = campaign.isTargeting(TargetType.AmmPoolLiquidity);

    const liquityV2 =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    const aaveV3 =
        campaign.isTargeting(TargetType.AaveV3Borrow) ||
        campaign.isTargeting(TargetType.AaveV3Supply) ||
        campaign.isTargeting(TargetType.AaveV3NetSupply) ||
        campaign.isTargeting(TargetType.AaveV3BridgeAndSupply);

    const empty = campaign.isTargeting(TargetType.Empty);

    return (
        <div className={styles.root}>
            {empty && <EmptyHeader campaign={campaign} />}
            {ammPoolLiquidity && <AmmPoolLiquityHeader campaign={campaign} />}
            {liquityV2 && <LiquityV2Header campaign={campaign} />}
            {aaveV3 && <AaveV3Header campaign={campaign} />}
        </div>
    );
}

export function SkeletonHeader() {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <Skeleton circular width={32} />
                    <PoolRemoteLogo
                        tokens={[{ address: "0x1" }, { address: "0x2" }]}
                        loading
                        size="xl"
                    />
                    <Skeleton size="xl4" width={400} />
                    <Skeleton size="lg" width={60} />
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

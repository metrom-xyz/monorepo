import { Skeleton } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { Campaign } from "@/src/types/campaign/common";
import { AmmPoolLiquityHeader } from "./amm-pool-liquitidy";
import { TargetType } from "@metrom-xyz/sdk";
import { LiquityV2Header } from "./liquity-v2";
import { AaveV3Header } from "./aave-v3";
import { EmptyHeader } from "./empty";
import { HoldFungibleAsset } from "./hold-fungible-asset";
import { SkeletonTags } from "./tags";
import { OdysseyHeader } from "./odyssey";

import styles from "./styles.module.css";

interface HeaderProps {
    campaign: Campaign;
}

export function Header({ campaign }: HeaderProps) {
    const ammPoolLiquidity =
        campaign.isTargeting(TargetType.AmmPoolLiquidity) ||
        campaign.isTargeting(TargetType.JumperWhitelistedAmmPoolLiquidity);

    const liquityV2 =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    const aaveV3 =
        campaign.isTargeting(TargetType.AaveV3Borrow) ||
        campaign.isTargeting(TargetType.AaveV3Supply) ||
        campaign.isTargeting(TargetType.AaveV3NetSupply) ||
        campaign.isTargeting(TargetType.AaveV3BridgeAndSupply);

    const holdFungibleAsset = campaign.isTargeting(
        TargetType.HoldFungibleAsset,
    );

    const odyssey = campaign.isTargeting(TargetType.Odyssey);

    const empty = campaign.isTargeting(TargetType.Empty);

    return (
        <div className={styles.root}>
            {empty && <EmptyHeader campaign={campaign} />}
            {ammPoolLiquidity && <AmmPoolLiquityHeader campaign={campaign} />}
            {liquityV2 && <LiquityV2Header campaign={campaign} />}
            {aaveV3 && <AaveV3Header campaign={campaign} />}
            {holdFungibleAsset && <HoldFungibleAsset campaign={campaign} />}
            {odyssey && <OdysseyHeader campaign={campaign} />}
        </div>
    );
}

export function SkeletonHeader() {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <Skeleton circular width={36} />
                    <PoolRemoteLogo
                        tokens={[{ address: "0x1" }, { address: "0x2" }]}
                        loading
                        size="lg"
                    />
                    <Skeleton size="xl3" width={400} />
                    <Skeleton size="lg" width={60} />
                </div>
                <SkeletonTags />
            </div>
            <div className={styles.actions}>
                <div className={styles.loadingAction}></div>
            </div>
        </div>
    );
}

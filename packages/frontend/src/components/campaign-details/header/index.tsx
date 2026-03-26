import { Skeleton } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import type { CampaignDetails } from "@/src/types/campaign";
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
    campaignDetails: CampaignDetails;
}

export function Header({ campaignDetails }: HeaderProps) {
    const ammPoolLiquidity =
        campaignDetails.isTargeting(TargetType.AmmPoolLiquidity) ||
        campaignDetails.isTargeting(
            TargetType.JumperWhitelistedAmmPoolLiquidity,
        );

    const liquityV2 =
        campaignDetails.isTargeting(TargetType.LiquityV2Debt) ||
        campaignDetails.isTargeting(TargetType.LiquityV2StabilityPool);

    const aaveV3 =
        campaignDetails.isTargeting(TargetType.AaveV3Borrow) ||
        campaignDetails.isTargeting(TargetType.AaveV3Supply) ||
        campaignDetails.isTargeting(TargetType.AaveV3NetSupply) ||
        campaignDetails.isTargeting(TargetType.AaveV3BridgeAndSupply);

    const holdFungibleAsset = campaignDetails.isTargeting(
        TargetType.HoldFungibleAsset,
    );

    const odyssey = campaignDetails.isTargeting(TargetType.Odyssey);

    const empty = campaignDetails.isTargeting(TargetType.Empty);

    return (
        <div className={styles.root}>
            {empty && <EmptyHeader campaignDetails={campaignDetails} />}
            {ammPoolLiquidity && (
                <AmmPoolLiquityHeader campaignDetails={campaignDetails} />
            )}
            {liquityV2 && <LiquityV2Header campaignDetails={campaignDetails} />}
            {aaveV3 && <AaveV3Header campaignDetails={campaignDetails} />}
            {holdFungibleAsset && (
                <HoldFungibleAsset campaignDetails={campaignDetails} />
            )}
            {odyssey && <OdysseyHeader campaignDetails={campaignDetails} />}
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

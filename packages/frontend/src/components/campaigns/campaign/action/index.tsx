import { Skeleton } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import { TargetType } from "@metrom-xyz/sdk";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import type { Campaign } from "@/src/types/campaign";
import { LiquidityV2 } from "./liquity-v2";
import { AaveV3 } from "./aave-v3";
import { Empty } from "./empty";
import { HoldFungibleAsset } from "./hold-fungible-asset";

import styles from "./styles.module.css";

interface ActionProps {
    campaign: Campaign;
}

export function Action({ campaign }: ActionProps) {
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

    const empty = campaign.isTargeting(TargetType.Empty);

    return (
        <div className={styles.root}>
            {empty && <Empty campaign={campaign} />}
            {ammPoolLiquidity && <AmmPoolLiquidity campaign={campaign} />}
            {liquityV2 && <LiquidityV2 campaign={campaign} />}
            {aaveV3 && <AaveV3 campaign={campaign} />}
            {holdFungibleAsset && <HoldFungibleAsset campaign={campaign} />}
        </div>
    );
}

export function SkeletonAction() {
    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                tokens={[{ address: "0x1" }, { address: "0x2" }]}
                loading
            />
            <div
                className={classNames(
                    styles.titleContainer,
                    styles.titleContainerLoading,
                )}
            >
                <Skeleton size="lg" width={120} />
                <Skeleton size="sm" width={50} className={styles.campaignFee} />
            </div>
        </div>
    );
}

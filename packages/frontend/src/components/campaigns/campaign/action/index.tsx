import { Skeleton } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import { TargetType } from "@metrom-xyz/sdk";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import type { Campaign } from "@/src/types/campaign";
import { LiquidityV2 } from "./liquity-v2";

import styles from "./styles.module.css";

interface ActionProps {
    campaign: Campaign;
}

export function Action({ campaign }: ActionProps) {
    const liquityV2Action =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <AmmPoolLiquidity campaign={campaign} />
            )}
            {liquityV2Action && <LiquidityV2 campaign={campaign} />}
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
                <Skeleton size="lg" width={300} />
                <Skeleton size="sm" width={50} className={styles.campaignFee} />
            </div>
        </div>
    );
}

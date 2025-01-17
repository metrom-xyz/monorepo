import { Skeleton } from "@metrom-xyz/ui";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import { TargetType } from "@metrom-xyz/sdk";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import type { NamedCampaign } from "@/src/types";

import styles from "./styles.module.css";

interface ActionProps {
    campaign: NamedCampaign;
}

export function Action({ campaign }: ActionProps) {
    return (
        <div className={styles.root}>
            {campaign.isTargeting(TargetType.AmmPoolLiquidity) && (
                <AmmPoolLiquidity campaign={campaign} />
            )}
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

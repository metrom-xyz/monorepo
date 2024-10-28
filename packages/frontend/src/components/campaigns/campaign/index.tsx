import { Apr, SkeletonApr } from "./apr";
import { Pool, SkeletonPool } from "./pool";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import type { NamedCampaign } from "@/src/hooks/useCampaigns";
import { Link } from "@/src/i18n/routing";
import { Card } from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignProps {
    campaign: NamedCampaign;
}

// TODO: reinstate the arrow on hover, but on click, bring the user
// to the provide liquidity page for the targeted dex
export function Campaign({ campaign }: CampaignProps) {
    return (
        <Link href={`/campaigns/${campaign.chainId}/${campaign.id}`}>
            <Card className={classNames(styles.root, styles.noMobile)}>
                <Chain id={campaign.chainId} />
                <div className={styles.poolContainer}>
                    <Pool campaign={campaign} />
                </div>
                <Status
                    from={campaign.from}
                    to={campaign.to}
                    status={campaign.status}
                />
                <Apr apr={campaign.apr} kpi={!!campaign.specification?.kpi} />
                <Rewards
                    status={campaign.status}
                    from={campaign.from}
                    to={campaign.to}
                    rewards={campaign.rewards}
                    chainId={campaign.chainId}
                />
            </Card>
            <Card className={styles.mobileCard}>
                <div className={styles.topRow}>
                    <Chain id={campaign.chainId} />
                    <Pool campaign={campaign} />
                </div>
                <div className={styles.bottomRow}>
                    <Status
                        from={campaign.from}
                        to={campaign.to}
                        status={campaign.status}
                    />
                    <Apr
                        apr={campaign.apr}
                        kpi={!!campaign.specification?.kpi}
                    />
                    <Rewards
                        status={campaign.status}
                        from={campaign.from}
                        to={campaign.to}
                        rewards={campaign.rewards}
                        chainId={campaign.chainId}
                    />
                </div>
            </Card>
        </Link>
    );
}

export function SkeletonCampaign() {
    return (
        <>
            <Card className={classNames(styles.root, styles.noMobile)}>
                <SkeletonChain />
                <div className={styles.poolContainer}>
                    <SkeletonPool />
                </div>
                <SkeletonStatus />
                <SkeletonApr />
                <SkeletonRewards />
            </Card>
            <Card className={styles.mobileCard}>
                <div className={styles.topRow}>
                    <SkeletonChain />
                    <SkeletonPool />
                </div>
                <div className={styles.bottomRow}>
                    <SkeletonStatus />
                    <SkeletonApr />
                    <SkeletonRewards />
                </div>
            </Card>
        </>
    );
}

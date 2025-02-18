import { Apr, SkeletonApr } from "./apr";
import { Action, SkeletonAction } from "./action";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import { Link } from "@/src/i18n/routing";
import { Card } from "@metrom-xyz/ui";
import classNames from "classnames";
import { Protocol, SkeletonProtocol } from "./protocol";
import { Points } from "./points";
import dayjs from "dayjs";
import { DistributablesType } from "@metrom-xyz/sdk";
import { type Campaign } from "@/src/types";

import styles from "./styles.module.css";

interface CampaignProps {
    campaign: Campaign;
}

// TODO: reinstate the arrow on hover, but on click, bring the user
// to the provide liquidity page for the targeted dex
export function CampaignRow({ campaign }: CampaignProps) {
    const hoursDuration = dayjs
        .unix(campaign.to)
        .diff(dayjs.unix(campaign.from), "hours", false);
    const daysDuration = hoursDuration / 24;

    const distributesTokens = campaign.isDistributing(
        DistributablesType.Tokens,
    );
    const distributesPoints = campaign.isDistributing(
        DistributablesType.Points,
    );

    return (
        <Link href={`/campaigns/${campaign.chainId}/${campaign.id}`}>
            <Card className={classNames(styles.root, styles.noMobile)}>
                <Chain id={campaign.chainId} />
                <Protocol campaign={campaign} />
                <div className={styles.poolContainer}>
                    <Action campaign={campaign} />
                </div>
                <Status
                    from={campaign.from}
                    to={campaign.to}
                    status={campaign.status}
                />
                <Apr apr={campaign.apr} kpi={!!campaign.specification?.kpi} />
                {distributesPoints && (
                    <Points
                        status={campaign.status}
                        amount={campaign.distributables.amount}
                        daysDuration={daysDuration}
                    />
                )}
                {distributesTokens && (
                    <Rewards
                        status={campaign.status}
                        daysDuration={daysDuration}
                        rewards={campaign.distributables}
                        chainId={campaign.chainId}
                    />
                )}
            </Card>
            <Card className={styles.mobileCard}>
                <div className={styles.topRow}>
                    <Chain id={campaign.chainId} />
                    <Protocol campaign={campaign} />
                    <Action campaign={campaign} />
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
                    {distributesPoints && (
                        <Points
                            status={campaign.status}
                            amount={campaign.distributables.amount}
                            daysDuration={daysDuration}
                        />
                    )}
                    {distributesTokens && (
                        <Rewards
                            status={campaign.status}
                            daysDuration={daysDuration}
                            rewards={campaign.distributables}
                            chainId={campaign.chainId}
                        />
                    )}
                </div>
            </Card>
        </Link>
    );
}

export function SkeletonCampaign() {
    return (
        <>
            <Card
                className={classNames(
                    styles.root,
                    styles.loading,
                    styles.noMobile,
                )}
            >
                <SkeletonChain />
                <SkeletonProtocol />
                <div className={styles.poolContainer}>
                    <SkeletonAction />
                </div>
                <SkeletonStatus />
                <SkeletonApr />
                <SkeletonRewards />
            </Card>
            <Card className={styles.mobileCard}>
                <div className={styles.topRow}>
                    <SkeletonChain />
                    <SkeletonProtocol />
                    <SkeletonAction />
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

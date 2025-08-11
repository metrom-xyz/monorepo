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
import { type Campaign } from "@/src/types/campaign";

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
        <Link
            href={`/campaigns/${campaign.chainType}/${campaign.chainId}/${campaign.id}`}
            className={styles.root}
        >
            <Card className={styles.card}>
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
                <Apr
                    campaignId={campaign.id}
                    chainId={campaign.chainId}
                    chainType={campaign.chainType}
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
            </Card>
        </Link>
    );
}

export function SkeletonCampaign() {
    return (
        <div className={styles.root}>
            <Card className={classNames(styles.card, styles.loading)}>
                <SkeletonChain />
                <SkeletonProtocol />
                <div className={styles.poolContainer}>
                    <SkeletonAction />
                </div>
                <SkeletonStatus />
                <SkeletonApr />
                <SkeletonRewards />
            </Card>
        </div>
    );
}

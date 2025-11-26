import { Apr, SkeletonApr } from "./apr";
import { Action, SkeletonAction } from "./action";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import { Link } from "@/src/i18n/routing";
import { Card, Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { Protocol, SkeletonProtocol } from "./protocol";
import {
    BackendCampaignType,
    DistributablesType,
    TargetType,
} from "@metrom-xyz/sdk";
import { type Campaign } from "@/src/types/campaign";
import { formatUsdAmount } from "@/src/utils/format";
import { Points } from "./points";
import { TURTLE_APP_EARN_URL } from "@/src/commons";

import styles from "./styles.module.css";

interface CampaignProps {
    type: BackendCampaignType;
    campaign: Campaign;
}

export function CampaignRow({ type, campaign }: CampaignProps) {
    const rewards = campaign.isDistributing(DistributablesType.Tokens);
    const fixedPoints = campaign.isDistributing(DistributablesType.FixedPoints);
    const dynamicPoints = campaign.isDistributing(
        DistributablesType.DynamicPoints,
    );
    const noDistributables = campaign.isDistributing(
        DistributablesType.NoDistributables,
    );
    const turtleCampaign = campaign.isTargeting(TargetType.Turtle);

    const href = campaign.isTargeting(TargetType.Turtle)
        ? `${TURTLE_APP_EARN_URL}/${campaign.target.opportunityId}`
        : `/campaigns/${campaign.chainType}/${campaign.chainId}/${campaign.id}`;

    return (
        <Link href={href} className={styles.root}>
            <Card className={styles.card}>
                <Chain id={campaign.chainId} type={campaign.chainType} />
                <Protocol campaign={campaign} />
                <div className={styles.poolContainer}>
                    <Action campaign={campaign} />
                </div>
                <Status
                    from={campaign.from}
                    to={campaign.to}
                    status={campaign.status}
                    showDuration={!turtleCampaign}
                />
                {type === BackendCampaignType.Rewards && (
                    <Apr
                        campaign={campaign}
                        apr={campaign.apr}
                        kpi={!!campaign.specification?.kpi}
                    />
                )}
                <Typography weight="medium">
                    {campaign.usdTvl !== undefined
                        ? formatUsdAmount({ amount: campaign.usdTvl })
                        : "-"}
                </Typography>
                {(fixedPoints || dynamicPoints) && (
                    <Points
                        status={campaign.status}
                        {...campaign.distributables}
                    />
                )}
                {rewards && (
                    <Rewards
                        status={campaign.status}
                        dailyUsd={campaign.distributables.dailyUsd}
                        rewards={campaign.distributables}
                        chainId={campaign.chainId}
                    />
                )}
                {/* TODO: what do we show here? */}
                {noDistributables && <div>-</div>}
            </Card>
        </Link>
    );
}

interface SkeletonCampaignProps {
    type: BackendCampaignType;
}

export function SkeletonCampaign({ type }: SkeletonCampaignProps) {
    return (
        <div className={styles.root}>
            <Card className={classNames(styles.card, styles.loading)}>
                <SkeletonChain />
                <SkeletonProtocol />
                <div className={styles.poolContainer}>
                    <SkeletonAction />
                </div>
                <SkeletonStatus />
                {type === BackendCampaignType.Rewards && <SkeletonApr />}
                <Skeleton width={100} />
                <SkeletonRewards />
            </Card>
        </div>
    );
}

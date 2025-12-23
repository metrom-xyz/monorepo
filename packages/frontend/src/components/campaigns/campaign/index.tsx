import { Apr, SkeletonApr } from "./apr";
import { Action, SkeletonAction } from "./action";
import { SkeletonStatus, Status } from "./status";
import {
    CampaignRewardsPopover,
    SkeletonCampaignRewards,
} from "../../campaign-rewards-popover";
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
import { TURTLE_APP_EARN_URL, TURTLE_REFERRAL_CODE } from "@/src/commons";

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

    const linkProps = campaign.isTargeting(TargetType.Turtle)
        ? {
              href: `${TURTLE_APP_EARN_URL}/${campaign.target.opportunityId}?ref=${TURTLE_REFERRAL_CODE}`,
              target: "_blank",
              rel: "noopener noreferrer",
          }
        : {
              href: `/campaigns/${campaign.chainType}/${campaign.chainId}/${campaign.id}`,
          };

    return (
        <Link {...linkProps} className={styles.root}>
            <Card className={styles.card}>
                <Chain id={campaign.chainId} type={campaign.chainType} />
                <Protocol campaign={campaign} />
                <div className={styles.pool}>
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
                    <CampaignRewardsPopover
                        logoSize="xs"
                        hideOnExpired
                        status={campaign.status}
                        chainId={campaign.chainId}
                        distributables={campaign.distributables}
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
                <SkeletonCampaignRewards />
            </Card>
        </div>
    );
}

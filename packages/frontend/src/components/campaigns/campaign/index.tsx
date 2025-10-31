import { Apr, SkeletonApr } from "./apr";
import { Action, SkeletonAction } from "./action";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import { Link } from "@/src/i18n/routing";
import { Card, Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { Protocol, SkeletonProtocol } from "./protocol";
import { Points } from "./points";
import dayjs from "dayjs";
import { DistributablesType } from "@metrom-xyz/sdk";
import { type Campaign } from "@/src/types/campaign";
import { formatUsdAmount } from "@/src/utils/format";

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

    const rewards = campaign.isDistributing(DistributablesType.Tokens);
    const fixedPoints = campaign.isDistributing(DistributablesType.FixedPoints);

    return (
        <Link
            href={`/campaigns/${campaign.chainType}/${campaign.chainId}/${campaign.id}`}
            className={styles.root}
        >
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
                />
                <Apr
                    campaign={campaign}
                    apr={campaign.apr}
                    kpi={!!campaign.specification?.kpi}
                />
                <Typography weight="medium">
                    {campaign.usdTvl !== undefined
                        ? formatUsdAmount({ amount: campaign.usdTvl })
                        : "-"}
                </Typography>
                {fixedPoints && (
                    <Points
                        status={campaign.status}
                        amount={campaign.distributables.amount}
                        daysDuration={daysDuration}
                    />
                )}
                {rewards && (
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
                <Skeleton width={100} />
                <SkeletonRewards />
            </Card>
        </div>
    );
}

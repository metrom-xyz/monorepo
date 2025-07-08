import { Apr, SkeletonApr } from "./apr";
import { Action, SkeletonAction } from "./action";
import { Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Link } from "@/src/i18n/routing";
import { Card, Chip, Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { Points } from "./points";
import dayjs from "dayjs";
import { DistributablesType, RestrictionType } from "@metrom-xyz/sdk";
import { type Campaign } from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { ChainChip } from "../../chain-chip";
import { ProtocolChip } from "../../protocol-chip";

import styles from "./styles.module.css";

interface CampaignProps {
    campaign: Campaign;
}

// TODO: reinstate the arrow on hover, but on click, bring the user
// to the provide liquidity page for the targeted dex
export function CampaignRow({ campaign }: CampaignProps) {
    const t = useTranslations("allCampaigns");

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
            href={`/campaigns/${campaign.chainId}/${campaign.id}`}
            className={styles.root}
        >
            <Card className={styles.card}>
                <div className={styles.details}>
                    <div className={styles.row}>
                        <Action campaign={campaign} />
                    </div>
                    <div className={styles.row}>
                        <ChainChip id={campaign.chainId} />
                        <ProtocolChip campaign={campaign} />
                        <Status
                            from={campaign.from}
                            to={campaign.to}
                            status={campaign.status}
                        />
                        {campaign.specification?.kpi && (
                            <Chip
                                variant="secondary"
                                border="squared"
                                className={{ root: styles.chip }}
                            >
                                <Typography size="xs" uppercase>
                                    {t("kpi")}
                                </Typography>
                            </Chip>
                        )}
                        {campaign.specification?.priceRange && (
                            <Chip
                                variant="secondary"
                                border="squared"
                                className={{ root: styles.chip }}
                            >
                                <Typography size="xs" uppercase>
                                    {t("pool.range")}
                                </Typography>
                            </Chip>
                        )}
                        {campaign.restrictions?.type ===
                            RestrictionType.Whitelist && (
                            <Chip
                                variant="secondary"
                                border="squared"
                                className={{ root: styles.chip }}
                            >
                                <Typography size="xs" uppercase>
                                    {t("restricted")}
                                </Typography>
                            </Chip>
                        )}
                    </div>
                </div>
                <Apr
                    campaignId={campaign.id}
                    chainId={campaign.chainId}
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
                <div className={styles.details}>
                    <div className={styles.row}>
                        <SkeletonAction />
                    </div>
                    <div className={styles.row}>
                        <Skeleton width={80} size="xl" />
                        <Skeleton width={80} size="xl" />
                        <Skeleton width={100} size="xl" />
                    </div>
                </div>
                <SkeletonApr />
                <SkeletonRewards />
            </Card>
        </div>
    );
}

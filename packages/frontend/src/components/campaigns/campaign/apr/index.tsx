"use client";

import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { AprChip } from "@/src/components/apr-chip";
import { useMemo, useRef, useState } from "react";
import { type Hex } from "viem";
import { useCampaign } from "@/src/hooks/useCampaign";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";
import { usePool } from "@/src/hooks/usePool";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { getDistributableRewardsPercentage } from "@/src/utils/kpi";
import { SECONDS_IN_YEAR } from "@/src/commons";

import styles from "./styles.module.css";

interface AprProps {
    campaignId: Hex;
    chainId: number;
    apr?: number;
    kpi?: boolean;
}

export function Apr({ campaignId, chainId, apr, kpi }: AprProps) {
    const t = useTranslations("allCampaigns.apr");

    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const { loading: loadingCampaign, campaign } = useCampaign({
        id: campaignId,
        chainId,
        enabled: popover && kpi !== undefined,
    });

    const ammCampaign = campaign?.isTargeting(TargetType.AmmPoolLiquidity);
    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);

    const { loading: loadingPool, pool } = usePool({
        id: ammCampaign ? campaign.target.pool.id : undefined,
        chainId: campaign ? campaign.target.chainId : 0,
        enabled: campaign && popover && kpi !== undefined,
    });

    const maxApr = useMemo(() => {
        if (
            !campaign ||
            !campaign.specification ||
            !campaign.specification.kpi ||
            !popover ||
            !tokensCampaign
        )
            return undefined;

        const { kpi } = campaign.specification;

        const distributaleRewardsPercentage = getDistributableRewardsPercentage(
            kpi.goal.upperUsdTarget,
            kpi.goal.lowerUsdTarget,
            kpi.goal.upperUsdTarget,
            kpi.minimumPayoutPercentage,
        );
        const distributedRewardsUsd =
            campaign.distributables.amountUsdValue *
            distributaleRewardsPercentage;

        const rewardsRatio = distributedRewardsUsd / kpi.goal.upperUsdTarget;
        const yearMultiplier = SECONDS_IN_YEAR / (campaign.to - campaign.from);
        const aprPercentage = rewardsRatio * yearMultiplier * 100;

        return aprPercentage;
    }, [popover, campaign, tokensCampaign]);

    function handlePopoverOpen() {
        if (apr === undefined) return;
        setPopover(true);
    }

    function handlePopoverClose() {
        if (apr === undefined) return;
        setPopover(false);
    }

    const loading = loadingCampaign || loadingPool || !campaign || !pool;

    return (
        <div className={styles.root}>
            <Popover
                placement="left"
                anchor={anchor}
                open={popover}
                ref={popoverRef}
            >
                {campaign && tokensCampaign && kpi && maxApr && (
                    <div className={styles.popoverContent}>
                        <Typography size="sm" weight="medium">
                            {t("templateText", {
                                lowerBound: formatUsdAmount({
                                    amount:
                                        campaign.specification?.kpi?.goal
                                            .lowerUsdTarget || 0,
                                }),
                                upperBound: formatUsdAmount({
                                    amount:
                                        campaign.specification?.kpi?.goal
                                            .upperUsdTarget || 0,
                                }),
                                maxApr: formatPercentage({
                                    percentage: maxApr,
                                }),
                            })}
                        </Typography>
                        <div className={styles.chartWrapper}>
                            <KpiSimulationChart
                                loading={loading}
                                poolUsdTvl={pool?.usdTvl}
                                tooltip={false}
                                campaignDurationSeconds={
                                    campaign.to - campaign.from
                                }
                                totalRewardsUsd={
                                    campaign.distributables.amountUsdValue
                                }
                                lowerUsdTarget={
                                    campaign.specification?.kpi?.goal
                                        .lowerUsdTarget
                                }
                                upperUsdTarget={
                                    campaign.specification?.kpi?.goal
                                        .upperUsdTarget
                                }
                                minimumPayoutPercentage={
                                    campaign.specification?.kpi
                                        ?.minimumPayoutPercentage
                                }
                            />
                        </div>
                    </div>
                )}
            </Popover>
            <div
                ref={setAnchor}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className={styles.aprWrapper}
            >
                <AprChip apr={apr} kpi={kpi} placeholder />
            </div>
        </div>
    );
}

export function SkeletonApr() {
    return <Skeleton width={80} size="xl" />;
}

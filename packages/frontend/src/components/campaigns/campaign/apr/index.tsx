"use client";

import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { AprChip } from "@/src/components/apr-chip";
import React, { useRef, useState } from "react";
import { type Hex } from "viem";
import { useCampaign } from "@/src/hooks/useCampaign";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";
import { usePool } from "@/src/hooks/usePool";
import { ChainType, DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { KpiAprSummary } from "@/src/components/kpi-apr-summary";

import styles from "./styles.module.css";

interface AprProps {
    campaignId: Hex;
    chainId: number;
    chainType: ChainType;
    apr?: number;
    kpi?: boolean;
}

export function Apr({ campaignId, chainId, chainType, apr, kpi }: AprProps) {
    const t = useTranslations("allCampaigns.apr");

    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { loading: loadingCampaign, campaign } = useCampaign({
        id: campaignId,
        chainId,
        chainType,
        enabled: popover && kpi !== undefined,
    });

    const ammCampaign = campaign?.isTargeting(TargetType.AmmPoolLiquidity);
    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);

    const { loading: loadingPool, pool } = usePool({
        id: ammCampaign ? campaign.target.pool.id : undefined,
        chainId: campaign?.target.chainId,
        chainType: campaign?.chainType,
        enabled: campaign && popover && kpi !== undefined && ammCampaign,
    });

    function handlePopoverOpen() {
        if (apr === undefined || !kpi) return;
        setPopover(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    function handlePopoverClose() {
        // Used to keep the popover open while moving to it
        timeoutRef.current = setTimeout(() => {
            setPopover(false);
        }, 100);
    }

    const loading =
        loadingCampaign || loadingPool || !campaign || (ammCampaign && !pool);
    const lowerBound = campaign?.specification?.kpi?.goal.lowerUsdTarget;
    const upperBound = campaign?.specification?.kpi?.goal.upperUsdTarget;
    const minimumPayout = campaign?.specification?.kpi?.minimumPayoutPercentage;

    return (
        <div
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={styles.root}
        >
            <div ref={setAnchor}>
                <Popover
                    placement="left"
                    anchor={anchor}
                    open={popover}
                    ref={popoverRef}
                >
                    {loading ? (
                        <SkeletonPopover />
                    ) : tokensCampaign && kpi ? (
                        <div className={styles.popoverContent}>
                            <Typography size="sm" weight="medium" uppercase>
                                {t("title")}
                            </Typography>
                            <KpiAprSummary campaign={campaign} />
                            <div className={styles.chartWrapper}>
                                <KpiSimulationChart
                                    loading={loading}
                                    usdTvl={campaign.getTargetUsdTvl()}
                                    campaignDurationSeconds={
                                        campaign.to - campaign.from
                                    }
                                    totalRewardsUsd={
                                        campaign.distributables.amountUsdValue
                                    }
                                    lowerUsdTarget={lowerBound}
                                    upperUsdTarget={upperBound}
                                    minimumPayoutPercentage={minimumPayout}
                                    // TODO: add liquidity in range to simulation?
                                    // range={liquidityInRange}
                                    tooltipSize="xs"
                                />
                            </div>
                        </div>
                    ) : null}
                </Popover>
            </div>
            <div className={styles.aprWrapper}>
                <AprChip apr={apr} kpi={kpi} placeholder />
            </div>
        </div>
    );
}

export function SkeletonApr() {
    return <Skeleton width={80} size="xl" />;
}

export function SkeletonPopover() {
    return (
        <div className={styles.popoverContent}>
            <Skeleton size="sm" width={120} />
            <Skeleton width={400} className={styles.skeletonDescription} />
            <div className={styles.chartWrapper}>
                <KpiSimulationChart
                    loading={true}
                    campaignDurationSeconds={0}
                    totalRewardsUsd={0}
                />
            </div>
        </div>
    );
}

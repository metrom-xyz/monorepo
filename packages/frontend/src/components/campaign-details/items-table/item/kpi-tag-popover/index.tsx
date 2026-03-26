import { SkeletonPopover } from "@/src/components/campaigns/campaign/apr";
import { KpiAprSummary } from "@/src/components/kpi-apr-summary";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";
import { usePool } from "@/src/hooks/usePool";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { CampaignTag } from "@/src/components/campaign-tag";
import type { CampaignItem } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface KpiTagPopoverProps {
    campaignItem: CampaignItem;
}

export function KpiTagPopover({ campaignItem }: KpiTagPopoverProps) {
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("campaignDetails.itemsTable.campaignItem.kpiTag");
    const popoverRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const ammCampaign = campaignItem.isTargeting(TargetType.AmmPoolLiquidity);
    const tokensCampaign = campaignItem.isDistributing(
        DistributablesType.Tokens,
    );

    const { loading: loadingPool, pool } = usePool({
        id: ammCampaign ? campaignItem.target.pool.id : undefined,
        chainId: campaignItem?.target.chainId,
        chainType: campaignItem.chainType,
        enabled:
            !!campaignItem &&
            popover &&
            campaignItem.hasKpiDistribution() &&
            ammCampaign,
    });

    const handlePopoverOpen = useCallback(() => {
        if (
            campaignItem.apr === undefined ||
            !campaignItem.hasKpiDistribution()
        )
            return;

        setPopover(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [campaignItem]);

    const handlePopoverClose = useCallback(() => {
        // Used to keep the popover open while moving to it
        timeoutRef.current = setTimeout(() => {
            setPopover(false);
        }, 100);
    }, []);

    if (!campaignItem.hasKpiDistribution()) return;

    const { goal, minimumPayoutPercentage } =
        campaignItem.specification.distribution;

    const loading = loadingPool || !campaignItem || (ammCampaign && !pool);

    return (
        <div
            ref={setAnchor}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={styles.root}
        >
            <Popover
                ref={popoverRef}
                anchor={anchor}
                open={popover}
                placement="bottom"
                onOpenChange={setPopover}
                className={styles.popover}
            >
                <div className={styles.content}>
                    <Typography size="sm" weight="semibold" uppercase>
                        {t("title")}
                    </Typography>
                    <KpiAprSummary campaignItem={campaignItem} />
                    {loading ? (
                        <SkeletonPopover />
                    ) : tokensCampaign && campaignItem.hasKpiDistribution() ? (
                        <div className={styles.chartWrapper}>
                            <KpiSimulationChart
                                loading={loading}
                                targetValueName={campaignItem.targetValueName}
                                targetUsdValue={campaignItem.usdTvl}
                                campaignDurationSeconds={
                                    campaignItem.to - campaignItem.from
                                }
                                totalRewardsUsd={
                                    campaignItem.distributables.amountUsdValue
                                }
                                lowerUsdTarget={goal.lowerUsdTarget}
                                upperUsdTarget={goal.upperUsdTarget}
                                minimumPayoutPercentage={
                                    minimumPayoutPercentage
                                }
                                // TODO: add liquidity in range to simulation?
                                // range={liquidityInRange}
                                tooltipSize="xs"
                            />
                        </div>
                    ) : null}
                </div>
            </Popover>
            <CampaignTag text={t("label")} />
        </div>
    );
}

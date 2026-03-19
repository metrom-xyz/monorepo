import { SkeletonPopover } from "@/src/components/campaigns/campaign/apr";
import { KpiAprSummary } from "@/src/components/kpi-apr-summary";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";
import { usePool } from "@/src/hooks/usePool";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { CampaignTag } from "@/src/components/campaign-tag";
import type { AggregatedCampaignItem } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface KpiTagPopoverProps {
    item: AggregatedCampaignItem;
}

export function KpiTagPopover({ item }: KpiTagPopoverProps) {
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("campaignDetails.itemsTable.item.kpiTag");
    const popoverRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const ammCampaign = item.isTargeting(TargetType.AmmPoolLiquidity);
    const tokensCampaign = item.isDistributing(DistributablesType.Tokens);

    const { loading: loadingPool, pool } = usePool({
        id: ammCampaign ? item.target.pool.id : undefined,
        chainId: item?.target.chainId,
        chainType: item.chainType,
        enabled: !!item && popover && item.hasKpiDistribution() && ammCampaign,
    });

    const handlePopoverOpen = useCallback(() => {
        if (item.apr === undefined || !item.hasKpiDistribution()) return;

        setPopover(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [item]);

    const handlePopoverClose = useCallback(() => {
        // Used to keep the popover open while moving to it
        timeoutRef.current = setTimeout(() => {
            setPopover(false);
        }, 100);
    }, []);

    if (!item.hasKpiDistribution()) return;

    const { goal, minimumPayoutPercentage } = item.specification.distribution;

    const loading = loadingPool || !item || (ammCampaign && !pool);

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
                    <KpiAprSummary item={item} />
                    {loading ? (
                        <SkeletonPopover />
                    ) : tokensCampaign && item.hasKpiDistribution() ? (
                        <div className={styles.chartWrapper}>
                            <KpiSimulationChart
                                loading={loading}
                                targetValueName={item.targetValueName}
                                targetUsdValue={item.usdTvl}
                                campaignDurationSeconds={item.to - item.from}
                                totalRewardsUsd={
                                    item.distributables.amountUsdValue
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

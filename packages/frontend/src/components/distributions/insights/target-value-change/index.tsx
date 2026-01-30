import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { CAMPAIGN_TARGET_TO_KIND, type Campaign } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";
import {
    formatDateTime,
    formatPercentageChange,
    formatUsdAmount,
} from "@/src/utils/format";
import dayjs from "dayjs";

import styles from "./styles.module.css";
import classNames from "classnames";

interface TargetValueChangeProps {
    campaign: Campaign;
}

export function TargetValueChange({ campaign }: TargetValueChangeProps) {
    const t = useTranslations("campaignDistributions.insights");
    const targetValueName = useCampaignTargetValueName({
        kind: CAMPAIGN_TARGET_TO_KIND[campaign.target.type],
    });

    const [popover, setPopover] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
        null,
    );
    const popoverRef = useRef<HTMLDivElement>(null);

    function onPopoverOpen() {
        setPopover(true);
    }

    function onPopoverClose() {
        setPopover(false);
    }

    const {
        kpiMeasurements: initialKpiMeasurements,
        loading: loadingFirstKpiMeasurements,
    } = useKpiMeasurements({
        campaign,
        from: dayjs.unix(campaign.from).utc().unix(),
        to: dayjs.unix(campaign.from).utc().add(1, "hour").unix(),
        enabled: campaign && !!campaign.specification?.kpi,
    });

    const {
        kpiMeasurements: lastKpiMeasurements,
        loading: loadingLastKpiMeasurements,
    } = useKpiMeasurements({
        campaign,
        enabled: campaign && !!campaign.specification?.kpi,
    });

    const {
        initialSnapshotTimestamp,
        latestSnapshotTimestamp,
        initialTargetUsdValue,
        latestTargetUsdValue,
        targetValuePercentageChange,
    } = useMemo(() => {
        if (
            loadingFirstKpiMeasurements ||
            loadingLastKpiMeasurements ||
            initialKpiMeasurements.length === 0 ||
            lastKpiMeasurements.length === 0
        )
            return {
                initialSnapshotTimestamp: 0,
                latestSnapshotTimestamp: 0,
                initialTargetUsdValue: 0,
                latestTargetUsdValue: 0,
                targetValuePercentageChange: 0,
            };

        const initialTargetUsdValue = initialKpiMeasurements[0].value;
        const latestTargetUsdValue =
            lastKpiMeasurements[lastKpiMeasurements.length - 1].value;

        return {
            initialSnapshotTimestamp: initialKpiMeasurements[0].from,
            latestSnapshotTimestamp:
                lastKpiMeasurements[lastKpiMeasurements.length - 1].to,
            initialTargetUsdValue,
            latestTargetUsdValue,
            targetValuePercentageChange:
                ((latestTargetUsdValue - initialTargetUsdValue) /
                    initialTargetUsdValue) *
                100,
        };
    }, [
        initialKpiMeasurements,
        lastKpiMeasurements,
        loadingFirstKpiMeasurements,
        loadingLastKpiMeasurements,
    ]);

    return (
        <>
            <Popover
                ref={popoverRef}
                anchor={popoverAnchor}
                open={popover}
                onOpenChange={setPopover}
            >
                <div className={styles.content}>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                        className={styles.header}
                    >
                        {t("targetValueChange", { targetValueName })}
                    </Typography>
                    <div className={styles.rows}>
                        <div className={styles.row}>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("atFirstSnapshot")}
                            </Typography>
                            <div>
                                <Typography size="sm" weight="medium" uppercase>
                                    {formatDateTime(initialSnapshotTimestamp)}
                                </Typography>
                                <Typography size="sm" weight="medium" uppercase>
                                    {formatUsdAmount({
                                        amount: initialTargetUsdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("atLatestSnapshot")}
                            </Typography>
                            <div>
                                <Typography size="sm" weight="medium" uppercase>
                                    {formatDateTime(latestSnapshotTimestamp)}
                                </Typography>
                                <Typography size="sm" weight="medium" uppercase>
                                    {formatUsdAmount({
                                        amount: latestTargetUsdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </Popover>
            {loadingFirstKpiMeasurements || loadingLastKpiMeasurements ? (
                <Skeleton width={100} />
            ) : (
                <Typography
                    ref={setPopoverAnchor}
                    weight="medium"
                    onMouseEnter={onPopoverOpen}
                    onMouseLeave={onPopoverClose}
                    className={classNames(styles.mainText, {
                        [styles.positive]: targetValuePercentageChange > 0,
                        [styles.negative]: targetValuePercentageChange < 0,
                    })}
                >
                    {formatPercentageChange({
                        percentage: targetValuePercentageChange,
                    })}
                </Typography>
            )}
        </>
    );
}

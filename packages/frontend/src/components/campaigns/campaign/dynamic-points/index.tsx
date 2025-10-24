import { Status } from "@metrom-xyz/sdk";
import { Popover, Typography } from "@metrom-xyz/ui";
import { PointsIcon } from "@/src/assets/points-icon";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface DynamicPointsProps {
    status: Status;
    distributionIntervalSeconds: number;
    multiplier: number;
    dailyPer1k?: number;
}

export function DynamicPoints({
    status,
    distributionIntervalSeconds,
    multiplier,
    dailyPer1k,
}: DynamicPointsProps) {
    const t = useTranslations("allCampaigns.points");

    const [popover, setPopover] = useState(false);
    const [breakdown, setBreakdown] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    function handleBreakdownPopoverOpen() {
        setPopover(true);
    }

    function handleBreakdownPopoverClose() {
        setPopover(false);
    }

    return (
        <div className={styles.root}>
            <Popover
                ref={popoverRef}
                open={popover}
                anchor={breakdown}
                onOpenChange={setPopover}
                placement="bottom"
            >
                <div className={styles.breakdownContainer}>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("tooltip.points")}
                    </Typography>
                    {/* TODO: implement tooltip content */}
                    <Typography size="lg" weight="medium">
                        Multiplier {multiplier}
                    </Typography>
                    <Typography size="lg" weight="medium">
                        Interval seconds {distributionIntervalSeconds}
                    </Typography>
                </div>
            </Popover>
            <div
                ref={setBreakdown}
                onMouseEnter={handleBreakdownPopoverOpen}
                onMouseLeave={handleBreakdownPopoverClose}
                className={styles.iconWrapper}
            >
                <PointsIcon className={styles.icon} />
            </div>
            <Typography weight="medium" className={styles.textPoints}>
                {status === Status.Expired
                    ? "-"
                    : formatAmount({ amount: dailyPer1k })}
            </Typography>
        </div>
    );
}

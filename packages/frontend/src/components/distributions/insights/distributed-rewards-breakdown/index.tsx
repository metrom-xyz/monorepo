import { Popover, Typography } from "@metrom-xyz/ui";
import { RemoteLogo } from "@/src/components/remote-logo";
import {
    formatAmount,
    formatPercentage,
    formatUsdAmount,
} from "@/src/utils/format";
import { useRef, useState } from "react";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface DistributedRewardsBreakdownProps {
    chain: number;
    totalUsdValue?: number;
    percentage?: number;
    rewards?: UsdPricedErc20TokenAmount[];
}

export function DistributedRewardsBreakdown({
    chain,
    totalUsdValue,
    percentage,
    rewards,
}: DistributedRewardsBreakdownProps) {
    const t = useTranslations("campaignDistributions.insights");

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

    if (totalUsdValue === undefined || percentage === undefined || !rewards)
        return "-";

    return (
        <>
            <Popover
                ref={popoverRef}
                anchor={popoverAnchor}
                open={popover}
                onOpenChange={setPopover}
            >
                <div className={styles.content}>
                    <div className={styles.header}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("totalUsdValue")}
                        </Typography>
                        <Typography size="sm" weight="medium">
                            {formatUsdAmount({ amount: totalUsdValue })}
                        </Typography>
                    </div>
                    <div className={styles.rows}>
                        {rewards.map(({ amount, token }) => (
                            <div
                                key={token.address}
                                className={styles.tokenRow}
                            >
                                <div className={styles.tokenWrapper}>
                                    <RemoteLogo
                                        size="xs"
                                        address={token.address}
                                        chain={chain}
                                    />
                                    <Typography size="sm" weight="medium">
                                        {token.symbol}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography size="sm" weight="medium">
                                        {formatAmount({
                                            amount: amount.formatted,
                                        })}
                                    </Typography>
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        variant="tertiary"
                                    >
                                        {formatUsdAmount({
                                            amount: amount.usdValue,
                                        })}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Popover>
            <Typography
                ref={setPopoverAnchor}
                weight="medium"
                onMouseEnter={onPopoverOpen}
                onMouseLeave={onPopoverClose}
                className={styles.mainText}
            >
                {formatPercentage({ percentage })}
            </Typography>
        </>
    );
}

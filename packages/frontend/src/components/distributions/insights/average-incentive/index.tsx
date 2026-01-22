import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { TokenDistributables } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface AverageIncentiveProps {
    chain: number;
    distributedUsdValue?: number;
    accountsIncentivized?: number;
    distributables: TokenDistributables;
}

export function AverageIncentive({
    chain,
    distributedUsdValue,
    accountsIncentivized,
    distributables,
}: AverageIncentiveProps) {
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

    const averageIncentiveUsd =
        distributedUsdValue && accountsIncentivized && accountsIncentivized > 0
            ? distributedUsdValue / accountsIncentivized
            : 0;

    const averageIncentivePercentage =
        distributables.amountUsdValue > 0
            ? (averageIncentiveUsd / distributables.amountUsdValue) * 100
            : 0;

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
                        {t("averageIncentive")}
                    </Typography>
                    <div className={styles.rows}>
                        {distributables.list.map(({ token, amount }) => {
                            const tokenAverageAmount =
                                (amount.formatted *
                                    averageIncentivePercentage) /
                                100;
                            const tokenAverageUsdValue =
                                (amount.usdValue * averageIncentivePercentage) /
                                100;

                            return (
                                <div key={token.address} className={styles.row}>
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
                                                amount: tokenAverageAmount,
                                            })}
                                        </Typography>
                                        <Typography
                                            size="sm"
                                            weight="medium"
                                            variant="tertiary"
                                        >
                                            {formatUsdAmount({
                                                amount: tokenAverageUsdValue,
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            );
                        })}
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
                {formatUsdAmount({
                    amount: averageIncentiveUsd,
                })}
            </Typography>
        </>
    );
}

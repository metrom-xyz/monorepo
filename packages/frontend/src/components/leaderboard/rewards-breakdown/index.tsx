import { Popover, Typography } from "@metrom-xyz/ui";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState } from "react";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RewardsBreakdownProps {
    chain?: SupportedChain;
    usdValue: number | null;
    distributed: UsdPricedErc20TokenAmount[];
}

export function RewardsBreakdown({
    chain,
    usdValue,
    distributed,
}: RewardsBreakdownProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [rewardedAmountWrapper, setRewardedAmountWrapper] =
        useState<HTMLDivElement | null>(null);
    const rewardsPopoverRef = useRef<HTMLDivElement>(null);

    function handleRewardedAmountPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleRewardedAmountPopoverClose() {
        setPopoverOpen(false);
    }

    const totalDistributedUsd = usdValue
        ? formatUsdAmount({ amount: usdValue, cutoff: false })
        : "-";

    return (
        <>
            <Popover
                ref={rewardsPopoverRef}
                anchor={rewardedAmountWrapper}
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                placement="top"
            >
                <div className={styles.popover}>
                    <div className={styles.header}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("distributedUsd")}
                        </Typography>
                        <Typography size="sm" weight="medium" uppercase>
                            {totalDistributedUsd}
                        </Typography>
                    </div>
                    <div className={styles.rows}>
                        {distributed
                            .sort(
                                (a, b) => b.amount.usdValue - a.amount.usdValue,
                            )
                            .map((distributed) => (
                                <div
                                    key={distributed.token.address}
                                    className={styles.row}
                                >
                                    <div>
                                        <RemoteLogo
                                            size="xs"
                                            chain={chain}
                                            address={distributed.token.address}
                                            defaultText={
                                                distributed.token.symbol
                                            }
                                        />
                                        <Typography weight="medium" size="sm">
                                            {distributed.token.symbol}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography weight="medium" size="sm">
                                            {formatAmount({
                                                amount: distributed.amount
                                                    .formatted,
                                                cutoff: false,
                                            })}
                                        </Typography>
                                        <Typography
                                            weight="medium"
                                            variant="tertiary"
                                            size="sm"
                                        >
                                            {distributed.amount.usdValue
                                                ? formatUsdAmount({
                                                      amount: distributed.amount
                                                          .usdValue,
                                                      cutoff: false,
                                                  })
                                                : "-"}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Popover>
            <div
                ref={setRewardedAmountWrapper}
                onMouseOver={handleRewardedAmountPopoverOpen}
                onMouseLeave={handleRewardedAmountPopoverClose}
                className={styles.rankWrapper}
            >
                <Typography weight="medium" variant="tertiary">
                    {totalDistributedUsd}
                </Typography>
            </div>
        </>
    );
}

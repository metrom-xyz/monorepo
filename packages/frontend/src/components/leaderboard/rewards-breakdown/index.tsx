import { Popover, Typography } from "@metrom-xyz/ui";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState } from "react";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";

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

    return (
        <>
            <Popover
                placement="top"
                anchor={rewardedAmountWrapper}
                open={popoverOpen}
                ref={rewardsPopoverRef}
            >
                <div className={styles.rewardsPopover}>
                    {distributed
                        .sort((a, b) => b.amount.usdValue - a.amount.usdValue)
                        .map((distributed) => (
                            <div
                                key={distributed.token.address}
                                className={styles.rewardsPopoverRow}
                            >
                                <div>
                                    <RemoteLogo
                                        chain={chain}
                                        address={distributed.token.address}
                                        defaultText={distributed.token.symbol}
                                    />
                                    <Typography weight="medium">
                                        {distributed.token.symbol}
                                    </Typography>
                                </div>
                                <Typography weight="medium">
                                    {formatAmount({
                                        amount: distributed.amount.formatted,
                                        cutoff: false,
                                    })}
                                </Typography>
                                <Typography weight="medium" light>
                                    {distributed.amount.usdValue
                                        ? formatUsdAmount({
                                              amount: distributed.amount
                                                  .usdValue,
                                              cutoff: false,
                                          })
                                        : "-"}
                                </Typography>
                            </div>
                        ))}
                </div>
            </Popover>
            <div
                ref={setRewardedAmountWrapper}
                onMouseOver={handleRewardedAmountPopoverOpen}
                onMouseLeave={handleRewardedAmountPopoverClose}
                className={styles.rankWrapper}
            >
                <Typography weight="medium" light>
                    {usdValue
                        ? formatUsdAmount({ amount: usdValue, cutoff: false })
                        : "-"}
                </Typography>
            </div>
        </>
    );
}

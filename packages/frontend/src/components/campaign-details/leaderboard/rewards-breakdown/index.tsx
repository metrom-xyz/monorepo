import { Popover, Typography } from "@metrom-xyz/ui";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useRef, useState } from "react";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface RewardsBreakdownProps {
    chain?: SupportedChain;
    usdValue: number | null;
    accrued: UsdPricedErc20TokenAmount[];
}

export function RewardsBreakdown({
    chain,
    usdValue,
    accrued,
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
                    {accrued.map((accruedReward) => (
                        <div
                            key={accruedReward.token.address}
                            className={styles.rewardsPopoverRow}
                        >
                            <div>
                                <RemoteLogo
                                    chain={chain}
                                    size="sm"
                                    address={accruedReward.token.address}
                                    defaultText={accruedReward.token.symbol}
                                />
                                <Typography weight="medium">
                                    {accruedReward.token.symbol}
                                </Typography>
                            </div>
                            <div>
                                <Typography weight="medium">
                                    {formatTokenAmount({
                                        amount: accruedReward.amount.formatted,
                                    })}
                                </Typography>
                                <Typography weight="medium">
                                    {accruedReward.amount.usdValue
                                        ? formatUsdAmount(
                                              accruedReward.amount.usdValue,
                                          )
                                        : "-"}
                                </Typography>
                            </div>
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
                    {usdValue ? formatUsdAmount(usdValue) : "-"}
                </Typography>
            </div>
        </>
    );
}

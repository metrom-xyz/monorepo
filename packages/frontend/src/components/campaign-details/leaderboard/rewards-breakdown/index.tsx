import { Popover, RemoteLogo, Typography } from "@metrom-xyz/ui";
import type { SupportedChain, UsdPricedTokenAmount } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface RewardsBreakdownProps {
    chain?: SupportedChain;
    usdValue: number | null;
    accrued: UsdPricedTokenAmount[];
}

export function RewardsBreakdown({
    chain,
    usdValue,
    accrued,
}: RewardsBreakdownProps) {
    const t = useTranslations("campaignDetails.leaderboard.personalRank");

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
                            key={accruedReward.address}
                            className={styles.rewardsPopoverRow}
                        >
                            <div>
                                <RemoteLogo
                                    chain={chain}
                                    size="sm"
                                    address={accruedReward.address}
                                    defaultText={accruedReward.symbol}
                                />
                                <Typography weight="medium">
                                    {accruedReward.symbol}
                                </Typography>
                            </div>
                            <div>
                                <Typography weight="medium">
                                    {formatTokenAmount(accruedReward.amount)}
                                </Typography>
                                <Typography weight="medium">
                                    {accruedReward.usdValue
                                        ? formatUsdAmount(
                                              accruedReward.usdValue,
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

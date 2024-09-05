import { Popover } from "@/src/ui/popover";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { Typography } from "@/src/ui/typography";
import type { SupportedChain, UsdPricedTokenAmount } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import numeral from "numeral";
import { useRef, useState } from "react";

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
                                    {numeral(accruedReward.amount).format(
                                        "(0.0[0] a)",
                                    )}
                                </Typography>
                                <Typography weight="medium">
                                    {accruedReward.usdValue
                                        ? numeral(
                                              accruedReward.usdValue,
                                          ).format("($ 0.00 a)")
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
                    {usdValue ? numeral(usdValue).format("($ 0.00 a)") : "-"}
                </Typography>
            </div>
        </>
    );
}

"use client";

import { Typography, Skeleton, Popover } from "@metrom-xyz/ui";
import { Status, type Rewards as RewardsType } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface RewardsProps {
    status: Status;
    from: number;
    to: number;
    rewards: RewardsType;
    chainId: SupportedChain;
}

export function Rewards({ status, from, to, rewards, chainId }: RewardsProps) {
    const t = useTranslations("allCampaigns.rewards");

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [rewardsBreakdown, setRewardsBreakdown] =
        useState<HTMLDivElement | null>(null);
    const breakdownPopoverRef = useRef<HTMLDivElement>(null);

    const daysDuration = dayjs.unix(to).diff(dayjs.unix(from), "days", false);
    const perDayUsdValue =
        daysDuration > 0 ? rewards.amountUsdValue / daysDuration : 0;

    function handleRewardsBreakdownPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleRewardsBreakdownPopoverClose() {
        setPopoverOpen(false);
    }

    return (
        <div className={styles.root}>
            <Popover
                open={popoverOpen}
                anchor={rewardsBreakdown}
                ref={breakdownPopoverRef}
                placement="top"
            >
                <div className={styles.breakdownContainer}>
                    <Typography
                        variant="sm"
                        weight="medium"
                        uppercase
                        className={styles.tooltipTitle}
                    >
                        {t("tooltip.rewards")}
                    </Typography>
                    {rewards.map((reward) => {
                        return (
                            <div
                                key={reward.token.address}
                                className={styles.breakdownRow}
                            >
                                <div>
                                    <RemoteLogo
                                        chain={chainId}
                                        size="sm"
                                        address={reward.token.address}
                                        defaultText={reward.token.symbol}
                                    />
                                    <Typography
                                        weight="medium"
                                        variant="sm"
                                        className={styles.tooltipText}
                                    >
                                        {reward.token.symbol}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        weight="medium"
                                        variant="sm"
                                        className={styles.tooltipText}
                                    >
                                        {formatTokenAmount({
                                            amount: reward.amount.formatted,
                                        })}
                                    </Typography>
                                </div>
                            </div>
                        );
                    })}
                    <Typography
                        weight="medium"
                        variant="sm"
                        uppercase
                        className={styles.tooltipTitle}
                    >
                        {t("tooltip.totalUsdValue")}
                    </Typography>
                    <Typography
                        variant="lg"
                        weight="medium"
                        className={styles.tooltipText}
                    >
                        {formatUsdAmount(rewards.amountUsdValue)}
                    </Typography>
                </div>
            </Popover>
            <div className={styles.rewardsWrapper}>
                <div
                    ref={setRewardsBreakdown}
                    onMouseEnter={handleRewardsBreakdownPopoverOpen}
                    onMouseLeave={handleRewardsBreakdownPopoverClose}
                    className={styles.tokenIcons}
                >
                    {rewards.map((reward, i) => {
                        return (
                            <div
                                key={reward.token.address}
                                className={styles.tokenIcon}
                            >
                                <RemoteLogo
                                    chain={chainId}
                                    address={reward.token.address}
                                    defaultText={reward.token.symbol}
                                />
                            </div>
                        );
                    })}
                </div>
                <Typography weight="medium" className={styles.textRewards}>
                    {status === Status.Ended
                        ? "-"
                        : formatUsdAmount(perDayUsdValue)}
                </Typography>
            </div>
        </div>
    );
}

export function SkeletonRewards() {
    return (
        <div className={styles.root}>
            <div className={styles.tokenIcons}>
                {new Array(5).fill(null).map((_, i) => {
                    return (
                        <div key={i} className={styles.tokenIcon}>
                            <RemoteLogo loading />
                        </div>
                    );
                })}
            </div>
            <Skeleton width={40} />
        </div>
    );
}

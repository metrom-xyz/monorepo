"use client";

import { Typography, Skeleton, Popover } from "@metrom-xyz/ui";
import { SupportedChain, type Rewards as RewardsType } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface RewardsProps {
    from: number;
    to: number;
    rewards: RewardsType;
    chainId: SupportedChain;
}

export function Rewards({ from, to, rewards, chainId }: RewardsProps) {
    const t = useTranslations("allCampaigns.rewards");

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [rewardsBreakdown, setRewardsBreakdown] =
        useState<HTMLDivElement | null>(null);
    const breakdownPopoverRef = useRef<HTMLDivElement>(null);

    const daysDuration = dayjs.unix(to).diff(dayjs.unix(from), "days", false);
    const perDayUsdValue =
        rewards.usdValue && daysDuration > 0
            ? rewards.usdValue / daysDuration
            : 0;

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
                        className={styles.tooltipTitle}
                        weight="medium"
                        uppercase
                    >
                        {t("tooltip.rewards")}
                    </Typography>
                    {rewards.map((reward, i) => {
                        return (
                            <div
                                key={reward.address}
                                className={styles.breakdownRow}
                            >
                                <div>
                                    <RemoteLogo
                                        chain={chainId}
                                        size="sm"
                                        address={reward.address}
                                        defaultText={reward.symbol}
                                    />
                                    <Typography
                                        className={styles.tooltipText}
                                        weight="medium"
                                        variant="sm"
                                    >
                                        {reward.symbol}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        className={styles.tooltipText}
                                        weight="medium"
                                        variant="sm"
                                    >
                                        {formatTokenAmount({
                                            amount: reward.amount,
                                        })}
                                    </Typography>
                                </div>
                            </div>
                        );
                    })}
                    <Typography
                        className={styles.tooltipTitle}
                        weight="medium"
                        variant="sm"
                        uppercase
                    >
                        {t("tooltip.totalUsdValue")}
                    </Typography>
                    <Typography
                        className={styles.tooltipText}
                        variant="lg"
                        weight="medium"
                    >
                        {rewards.usdValue
                            ? formatUsdAmount(rewards.usdValue)
                            : "-"}
                    </Typography>
                </div>
            </Popover>
            <div
                ref={setRewardsBreakdown}
                className={styles.tokenIcons}
                onMouseEnter={handleRewardsBreakdownPopoverOpen}
                onMouseLeave={handleRewardsBreakdownPopoverClose}
            >
                {rewards.map((reward, i) => {
                    return (
                        <div
                            key={reward.address}
                            className={styles.tokenIcon}
                            style={{ left: i * 10 }}
                        >
                            <RemoteLogo
                                chain={chainId}
                                address={reward.address}
                                defaultText={reward.symbol}
                            />
                        </div>
                    );
                })}
            </div>
            <Typography className={styles.textRewards} weight="medium">
                {formatUsdAmount(perDayUsdValue)}
            </Typography>
        </div>
    );
}

export function SkeletonRewards() {
    return (
        <div className={styles.root}>
            <div className={styles.tokenIcons}>
                {new Array(5).fill(null).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className={styles.tokenIcon}
                            style={{ left: i * 10 }}
                        >
                            <RemoteLogo loading />
                        </div>
                    );
                })}
            </div>
            <Skeleton width={40} />
        </div>
    );
}

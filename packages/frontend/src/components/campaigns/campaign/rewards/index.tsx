"use client";

import { Typography, Skeleton, Popover } from "@metrom-xyz/ui";
import { Status, type TokenDistributables } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RemoteLogo } from "@/src/components/remote-logo";
import classNames from "classnames";

import styles from "./styles.module.css";

interface RewardsProps {
    status: Status;
    dailyUsd: number;
    rewards: TokenDistributables;
    chainId: SupportedChain;
}

export function Rewards({ status, dailyUsd, rewards, chainId }: RewardsProps) {
    const t = useTranslations("allCampaigns.rewards");

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [rewardsBreakdown, setRewardsBreakdown] =
        useState<HTMLDivElement | null>(null);
    const breakdownPopoverRef = useRef<HTMLDivElement>(null);

    function handleRewardsBreakdownPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleRewardsBreakdownPopoverClose() {
        setPopoverOpen(false);
    }

    return (
        <div className={styles.root}>
            <Popover
                ref={breakdownPopoverRef}
                open={popoverOpen}
                anchor={rewardsBreakdown}
                onOpenChange={setPopoverOpen}
                placement="bottom"
            >
                <div className={styles.breakdownContainer}>
                    <Typography
                        size="sm"
                        weight="medium"
                        uppercase
                        variant="tertiary"
                    >
                        {t("tooltip.rewards")}
                    </Typography>
                    {rewards.list
                        .sort((a, b) => b.amount.usdValue - a.amount.usdValue)
                        .map((reward) => {
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
                                        <Typography weight="medium" size="sm">
                                            {reward.token.symbol}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography weight="medium" size="sm">
                                            {formatAmount({
                                                amount: reward.amount.formatted,
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            );
                        })}
                    <Typography
                        weight="medium"
                        size="sm"
                        uppercase
                        variant="tertiary"
                    >
                        {t("tooltip.totalUsdValue")}
                    </Typography>
                    <Typography size="lg" weight="medium">
                        {formatUsdAmount({ amount: rewards.amountUsdValue })}
                    </Typography>
                </div>
            </Popover>
            <div
                ref={setRewardsBreakdown}
                onMouseEnter={handleRewardsBreakdownPopoverOpen}
                onMouseLeave={handleRewardsBreakdownPopoverClose}
                className={styles.rewardsWrapper}
            >
                <div className={styles.tokenIcons}>
                    {rewards.list.map((reward, i) => {
                        return (
                            <div
                                key={reward.token.address}
                                className={styles.tokenIcon}
                                style={{ zIndex: i }}
                            >
                                <RemoteLogo
                                    size="sm"
                                    chain={chainId}
                                    address={reward.token.address}
                                    defaultText={reward.token.symbol}
                                />
                            </div>
                        );
                    })}
                </div>
                <Typography weight="medium" className={styles.textRewards}>
                    {status === Status.Expired
                        ? "-"
                        : formatUsdAmount({ amount: dailyUsd })}
                </Typography>
            </div>
        </div>
    );
}

export function SkeletonRewards() {
    return (
        <div className={classNames(styles.rewardsWrapper, styles.loading)}>
            <div className={styles.tokenIcons}>
                {new Array(3).fill(null).map((_, i) => {
                    return (
                        <div key={i} className={styles.tokenIcon}>
                            <RemoteLogo size="sm" loading />
                        </div>
                    );
                })}
            </div>
            <Skeleton className={styles.textRewards} />
        </div>
    );
}

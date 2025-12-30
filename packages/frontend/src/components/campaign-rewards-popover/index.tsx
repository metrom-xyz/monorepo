"use client";

import {
    Typography,
    Skeleton,
    Popover,
    type RemoteLogoSize,
    type TypographySize,
} from "@metrom-xyz/ui";
import { Status, type TokenDistributables } from "@metrom-xyz/sdk";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RemoteLogo } from "@/src/components/remote-logo";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignRewardsPopoverProps {
    status: Status;
    chainId: number;
    distributables: TokenDistributables;
    hideUsdValue?: boolean;
    hideOnExpired?: boolean;
    hideSymbol?: boolean;
    logoSize?: RemoteLogoSize;
    symbolSize?: TypographySize;
}

export function CampaignRewardsPopover({
    status,
    chainId,
    distributables,
    hideUsdValue = false,
    hideOnExpired = false,
    hideSymbol = false,
    logoSize = "sm",
    symbolSize = "sm",
}: CampaignRewardsPopoverProps) {
    const t = useTranslations("campaignRewardsPopover");

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

    const showRewards = hideOnExpired ? status !== Status.Expired : true;

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
                    <div className={styles.header}>
                        <Typography
                            size="sm"
                            weight="medium"
                            uppercase
                            variant="tertiary"
                        >
                            {t("totalUsdValue")}
                        </Typography>
                        <Typography size="sm" weight="medium">
                            {formatUsdAmount({
                                amount: distributables.amountUsdValue,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.rows}>
                        {distributables.list
                            .sort(
                                (a, b) => b.amount.usdValue - a.amount.usdValue,
                            )
                            .map((reward) => {
                                return (
                                    <div
                                        key={reward.token.address}
                                        className={styles.breakdownRow}
                                    >
                                        <div>
                                            <RemoteLogo
                                                chain={chainId}
                                                size="xs"
                                                address={reward.token.address}
                                                defaultText={
                                                    reward.token.symbol
                                                }
                                            />
                                            <Typography
                                                weight="medium"
                                                size="sm"
                                            >
                                                {reward.token.symbol}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                                weight="medium"
                                                size="sm"
                                            >
                                                {formatAmount({
                                                    amount: reward.amount
                                                        .formatted,
                                                })}
                                            </Typography>
                                            <Typography
                                                variant="tertiary"
                                                weight="medium"
                                                size="sm"
                                            >
                                                {formatUsdAmount({
                                                    amount: reward.amount
                                                        .usdValue,
                                                })}
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </Popover>
            <div
                ref={setRewardsBreakdown}
                onMouseEnter={handleRewardsBreakdownPopoverOpen}
                onMouseLeave={handleRewardsBreakdownPopoverClose}
                className={styles.rewardsWrapper}
            >
                {showRewards && (
                    <div className={styles.tokenIcons}>
                        {distributables.list.map((reward, i) => {
                            return (
                                <div
                                    key={reward.token.address}
                                    className={styles.tokenIcon}
                                    style={{ zIndex: i }}
                                >
                                    <RemoteLogo
                                        size={logoSize}
                                        chain={chainId}
                                        address={reward.token.address}
                                        defaultText={reward.token.symbol}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
                {!hideSymbol && distributables.list.length === 1 && (
                    <Typography
                        size={symbolSize}
                        weight="medium"
                        className={classNames({
                            [styles.xl2]: symbolSize === "xl2",
                        })}
                    >
                        {distributables.list[0].token.symbol}
                    </Typography>
                )}
                {!hideUsdValue && (
                    <Typography weight="medium" className={styles.textRewards}>
                        {status === Status.Expired
                            ? "-"
                            : formatUsdAmount({
                                  amount: distributables.dailyUsd,
                              })}
                    </Typography>
                )}
            </div>
        </div>
    );
}

interface SkeletonCampaignRewardsProps {
    logoSize?: RemoteLogoSize;
}

export function SkeletonCampaignRewards({
    logoSize = "sm",
}: SkeletonCampaignRewardsProps) {
    return (
        <div className={classNames(styles.rewardsWrapper, styles.loading)}>
            <div className={styles.tokenIcons}>
                {new Array(3).fill(null).map((_, i) => {
                    return (
                        <div key={i} className={styles.tokenIcon}>
                            <RemoteLogo size={logoSize} loading />
                        </div>
                    );
                })}
            </div>
            <Skeleton className={styles.textRewards} />
        </div>
    );
}

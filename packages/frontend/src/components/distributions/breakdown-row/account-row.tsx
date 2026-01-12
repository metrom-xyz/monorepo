import { type Address } from "viem";
import { getColorFromAddress, isZeroAddress } from "@/src/utils/address";
import { Popover, Skeleton, Theme, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import {
    formatAmount,
    formatAmountChange,
    formatPercentage,
    formatUsdAmount,
    formatUsdAmountChange,
} from "@/src/utils/format";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import type { DistributedErc20Token, Weight } from "@/src/types/distributions";
import { RemoteLogo } from "../../remote-logo";
import { TrendUpIcon } from "@/src/assets/trend-up";
import { TrendDownIcon } from "@/src/assets/trend-down";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface AccountRowProps {
    rank: number;
    chainId: number;
    account: Address;
    connected: boolean;
    totalUsdAmount: number;
    usdAmount: number;
    usdAmountChange: number;
    weights: Record<string, Weight>;
    tokens: Record<string, DistributedErc20Token>;
    tokensSummary: Record<string, UsdPricedErc20TokenAmount>;
    percentage: number;
}

export function AccountRow({
    rank,
    chainId,
    account,
    connected,
    totalUsdAmount,
    usdAmount,
    usdAmountChange,
    weights,
    tokens,
    tokensSummary,
    percentage,
}: AccountRowProps) {
    const t = useTranslations("campaignDistributions");
    const { resolvedTheme } = useTheme();

    const [currentDistroPopover, setCurrentDistroPopover] = useState(false);
    const [currentDistroAnchor, setCurrentDistroAnchor] =
        useState<HTMLDivElement | null>(null);
    const currentDistroPopoverRef = useRef<HTMLDivElement>(null);

    const [totalDistroPopover, setTotalDistroPopover] = useState(false);
    const [totalDistroAnchor, setTotalDistroAnchor] =
        useState<HTMLDivElement | null>(null);
    const totalDistroPopoverRef = useRef<HTMLDivElement>(null);

    function handleCurrentDistroPopoverOpen() {
        setCurrentDistroPopover(true);
    }

    function handleCurrentDistroPopoverClose() {
        setCurrentDistroPopover(false);
    }

    function handleTotalDistroPopoverOpen() {
        setTotalDistroPopover(true);
    }

    function handleTotalDistroPopoverClose() {
        setTotalDistroPopover(false);
    }

    return (
        <div className={styles.accountRow}>
            <Typography variant="tertiary" weight="medium">
                #{rank + 1}
            </Typography>
            <Typography>{formatPercentage({ percentage })}</Typography>
            <div className={styles.account}>
                <div
                    className={styles.legend}
                    style={{
                        backgroundColor: getColorFromAddress(
                            account as Address,
                            resolvedTheme as Theme,
                        ),
                    }}
                ></div>
                <Typography
                    size="sm"
                    variant="tertiary"
                    weight="medium"
                    className={classNames({
                        [styles.connected]: connected,
                    })}
                >
                    {isZeroAddress(account) ? t("reimbursed") : account}
                </Typography>
            </div>
            <Popover
                ref={currentDistroPopoverRef}
                anchor={currentDistroAnchor}
                open={currentDistroPopover}
                onOpenChange={setCurrentDistroPopover}
            >
                <div className={styles.distroPopover}>
                    <div className={styles.popoverHeader}>
                        <Typography
                            size="sm"
                            weight="medium"
                            uppercase
                            variant="tertiary"
                        >
                            {isZeroAddress(account)
                                ? t("reimbursedInThisDistro")
                                : t("earnedInThisDistro")}
                        </Typography>
                        <Typography size="sm" weight="medium">
                            {formatUsdAmount({
                                amount: usdAmount,
                            })}
                        </Typography>
                    </div>
                    <div className={styles.popoverTokenRows}>
                        {Object.entries(weights).map(
                            ([tokenAddress, weight]) => {
                                const positiveTrend =
                                    weight.amountChange.formatted > 0;
                                const negativeTrend =
                                    weight.amountChange.formatted < 0;

                                const token = tokens[tokenAddress].token;

                                return (
                                    <div
                                        key={tokenAddress}
                                        className={styles.tokenRow}
                                    >
                                        <div>
                                            <RemoteLogo
                                                size="xs"
                                                chain={chainId}
                                                address={
                                                    tokenAddress as Address
                                                }
                                            />
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                            >
                                                {token.symbol}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                            >
                                                {formatAmount({
                                                    amount: weight.amount
                                                        .formatted,
                                                })}
                                            </Typography>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                variant="tertiary"
                                            >
                                                {formatUsdAmount({
                                                    amount: weight.usdAmount,
                                                })}
                                            </Typography>
                                        </div>
                                        <div
                                            className={classNames(
                                                styles.amountChangeBox,
                                                {
                                                    [styles.positive]:
                                                        positiveTrend,
                                                    [styles.negative]:
                                                        negativeTrend,
                                                },
                                            )}
                                        >
                                            {positiveTrend ? (
                                                <TrendUpIcon
                                                    className={styles.trendIcon}
                                                />
                                            ) : negativeTrend ? (
                                                <TrendDownIcon
                                                    className={styles.trendIcon}
                                                />
                                            ) : null}
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                className={classNames(
                                                    styles.change,
                                                    {
                                                        [styles.positive]:
                                                            positiveTrend,
                                                        [styles.negative]:
                                                            negativeTrend,
                                                    },
                                                )}
                                            >
                                                {formatAmountChange({
                                                    amount: weight.amountChange
                                                        .formatted,
                                                })}
                                            </Typography>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                className={classNames(
                                                    styles.change,
                                                    {
                                                        [styles.positive]:
                                                            positiveTrend,
                                                        [styles.negative]:
                                                            negativeTrend,
                                                    },
                                                )}
                                            >
                                                {formatUsdAmountChange({
                                                    amount: weight.usdAmountChange,
                                                })}
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
            </Popover>
            <div
                ref={setCurrentDistroAnchor}
                onMouseEnter={handleCurrentDistroPopoverOpen}
                onMouseLeave={handleCurrentDistroPopoverClose}
                className={styles.amount}
            >
                <Typography>
                    {formatUsdAmount({ amount: usdAmount })}
                </Typography>
                {usdAmountChange !== 0 && (
                    <div
                        className={classNames(styles.amountChangeBox, {
                            [styles.positive]: usdAmountChange > 0,
                            [styles.negative]: usdAmountChange < 0,
                        })}
                    >
                        {usdAmountChange > 0 ? (
                            <TrendUpIcon className={styles.trendIcon} />
                        ) : usdAmountChange < 0 ? (
                            <TrendDownIcon className={styles.trendIcon} />
                        ) : null}
                        <Typography
                            size="xs"
                            className={classNames(styles.change, {
                                [styles.positive]: usdAmountChange > 0,
                                [styles.negative]: usdAmountChange < 0,
                            })}
                        >
                            {formatUsdAmountChange({ amount: usdAmountChange })}
                        </Typography>
                    </div>
                )}
            </div>
            <Popover
                ref={totalDistroPopoverRef}
                anchor={totalDistroAnchor}
                open={totalDistroPopover}
                onOpenChange={setTotalDistroPopover}
            >
                <div className={styles.distroPopover}>
                    <div className={styles.popoverHeader}>
                        <Typography
                            size="sm"
                            weight="medium"
                            uppercase
                            variant="tertiary"
                        >
                            {isZeroAddress(account)
                                ? t("totalReimbursed")
                                : t("totalEarned")}
                        </Typography>
                        <Typography size="sm" weight="medium">
                            {formatUsdAmount({
                                amount: totalUsdAmount,
                            })}
                        </Typography>
                    </div>
                    {Object.entries(tokensSummary).map(
                        ([tokenAddress, tokenAmount]) => {
                            const token = tokens[tokenAddress].token;

                            return (
                                <div
                                    key={tokenAddress}
                                    className={styles.totalEearnedTokenRow}
                                >
                                    <div>
                                        <RemoteLogo
                                            size="xs"
                                            chain={chainId}
                                            address={tokenAddress as Address}
                                        />
                                        <Typography size="sm" weight="medium">
                                            {token.symbol}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography size="sm" weight="medium">
                                            {formatAmount({
                                                amount: tokenAmount.amount
                                                    .formatted,
                                            })}
                                        </Typography>
                                        <Typography
                                            size="sm"
                                            weight="medium"
                                            variant="tertiary"
                                        >
                                            {formatUsdAmount({
                                                amount: tokenAmount.amount
                                                    .usdValue,
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </Popover>
            <div
                ref={setTotalDistroAnchor}
                onMouseEnter={handleTotalDistroPopoverOpen}
                onMouseLeave={handleTotalDistroPopoverClose}
                className={styles.amount}
            >
                <Typography>
                    {formatUsdAmount({ amount: totalUsdAmount })}
                </Typography>
            </div>
        </div>
    );
}

export function AccountRowSkeleton() {
    return (
        <div className={styles.accountRow}>
            <div className={styles.account}>
                <Skeleton width={380} size="sm" />
            </div>
            <div className={classNames(styles.amount, styles.loading)}>
                <Skeleton width={100} size="sm" />
                <Skeleton width={25} size="xs" />
            </div>
            <Skeleton width={100} size="sm" />
        </div>
    );
}

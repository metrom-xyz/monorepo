import { type Address } from "viem";
import { getColorFromAddress, isZeroAddress } from "@/src/utils/address";
import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import {
    formatAmount,
    formatAmountChange,
    formatPercentage,
    formatUsdAmount,
    formatUsdAmountChange,
} from "@/src/utils/format";
import { useRef, useState } from "react";
import type { DistributedErc20Token, Weight } from "@/src/types/distributions";
import { RemoteLogo } from "../../remote-logo";
import { TrendUpIcon } from "@/src/assets/trend-up";
import { TrendDownIcon } from "@/src/assets/trend-down";
import type { ChainType, UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { getExplorerLink } from "@/src/utils/explorer";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

interface AccountRowProps {
    rank: number;
    chainId: number;
    chainType: ChainType;
    account: Address;
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
    chainType,
    account,
    totalUsdAmount,
    usdAmount,
    usdAmountChange,
    weights,
    tokens,
    tokensSummary,
    percentage,
}: AccountRowProps) {
    const t = useTranslations("campaignDistributions");

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
            <Typography weight="medium">
                {formatPercentage({ percentage })}
            </Typography>
            <div className={styles.account}>
                <div
                    className={styles.legend}
                    style={{
                        backgroundColor: getColorFromAddress(
                            account as Address,
                        ),
                    }}
                ></div>
                <Typography weight="medium">
                    {isZeroAddress(account) ? t("reimbursed") : account}
                </Typography>
                <a
                    href={getExplorerLink(account, chainId, chainType)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ArrowRightIcon className={styles.externalLinkIcon} />
                </a>
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
                                                className={classNames({
                                                    [styles.trendUp]:
                                                        positiveTrend,
                                                    [styles.trendDown]:
                                                        negativeTrend,
                                                })}
                                            >
                                                {formatAmountChange({
                                                    amount: weight.amountChange
                                                        .formatted,
                                                })}
                                            </Typography>
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                className={classNames({
                                                    [styles.trendUp]:
                                                        positiveTrend,
                                                    [styles.trendDown]:
                                                        negativeTrend,
                                                })}
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
                <Typography weight="medium">
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
                            className={classNames({
                                [styles.trendUp]: usdAmountChange > 0,
                                [styles.trendDown]: usdAmountChange < 0,
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
                <Typography weight="medium">
                    {formatUsdAmount({ amount: totalUsdAmount })}
                </Typography>
            </div>
        </div>
    );
}

export function AccountRowSkeleton() {
    return (
        <div className={styles.accountRow}>
            <Skeleton width={42} />
            <Skeleton width={42} />
            <div className={styles.account}>
                <Skeleton width={20} />
                <Skeleton width={380} />
            </div>
            <div className={classNames(styles.amount, styles.loading)}>
                <Skeleton width={100} />
                <Skeleton width={60} />
            </div>
            <Skeleton width={80} />
        </div>
    );
}

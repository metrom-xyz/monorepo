import { useCallback } from "react";
import { type WhitelistedErc20Token } from "@metrom-xyz/sdk";
import type { Erc20TokenWithBalance } from "@/src/hooks/use-watch-balances";
import classNames from "classnames";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { RowComponentProps } from "react-window";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";

import styles from "./styles.module.css";

interface PickerRowProps {
    tokensWithBalance: Erc20TokenWithBalance<WhitelistedErc20Token>[];
    unavailable?: WhitelistedErc20TokenAmount[];
    chain: number;
    loading?: boolean;
    value?: WhitelistedErc20Token;
    onClick: (token: WhitelistedErc20Token) => void;
}

export function Row({
    tokensWithBalance,
    unavailable,
    chain,
    style,
    index,
    loading,
    value,
    onClick,
}: RowComponentProps<PickerRowProps>) {
    const tokenWithBalance = tokensWithBalance[index];
    const disabled = !!unavailable?.find(
        ({ token: { address } }) => address === tokenWithBalance?.token.address,
    );
    const active =
        !!tokenWithBalance && tokenWithBalance.token.address === value?.address;

    const handleRewardTokenOnClick = useCallback(() => {
        if (!tokenWithBalance || disabled) return;
        onClick(tokenWithBalance.token);
    }, [disabled, onClick, tokenWithBalance]);

    return (
        <div
            style={style}
            className={classNames(styles.root, {
                [styles.loading]: loading,
                [styles.disabled]: disabled,
                [styles.active]: active,
            })}
            onClick={handleRewardTokenOnClick}
        >
            <div className={styles.token}>
                {loading ? (
                    <Skeleton circular width={36} />
                ) : (
                    <RemoteLogo
                        size="sm"
                        address={tokenWithBalance?.token.address}
                        chain={chain}
                    />
                )}
                {loading ? (
                    <Skeleton width={80} />
                ) : (
                    <Typography weight="medium" size="lg">
                        {tokenWithBalance?.token.symbol}
                    </Typography>
                )}
            </div>
            {loading || !tokenWithBalance ? (
                <div className={styles.balanceWrapper}>
                    <Skeleton width={36} size="sm" />
                    <Skeleton width={36} size="xs" />
                </div>
            ) : (
                <div className={styles.balanceWrapper}>
                    <Typography size="sm" weight="medium">
                        {tokenWithBalance.balance
                            ? formatAmount({
                                  amount: tokenWithBalance.balance.formatted,
                              })
                            : "-"}
                    </Typography>
                    <Typography size="xs" weight="medium" variant="tertiary">
                        {tokenWithBalance.balance
                            ? formatUsdAmount({
                                  amount:
                                      tokenWithBalance.balance.formatted *
                                      tokenWithBalance.token.usdPrice,
                              })
                            : "-"}
                    </Typography>
                </div>
            )}
        </div>
    );
}

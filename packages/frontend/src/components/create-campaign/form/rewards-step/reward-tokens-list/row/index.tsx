import { useCallback } from "react";
import { formatUnits } from "viem";
import {
    type WhitelistedErc20Token,
    type WhitelistedErc20TokenWithBalance,
} from "@metrom-xyz/sdk";
import classNames from "classnames";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import { formatTokenAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface PickerRowProps {
    token: WhitelistedErc20TokenWithBalance | null;
    chain: number;
    style?: any;
    loading?: boolean;
    disabled?: boolean;
    active?: boolean;
    onClick: (token: WhitelistedErc20Token) => void;
}

export function Row({
    token,
    chain,
    style,
    loading,
    disabled,
    active,
    onClick,
}: PickerRowProps) {
    const handleRewardTokenOnClick = useCallback(() => {
        if (!token || disabled) return;
        onClick(token);
    }, [disabled, onClick, token]);

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
                    <Skeleton circular width="36px" />
                ) : (
                    <RemoteLogo
                        size="sm"
                        address={token?.address}
                        chain={chain}
                    />
                )}
                {loading ? (
                    <Skeleton width="40px" variant="xs" />
                ) : (
                    <Typography weight="medium" variant="lg">
                        {token?.name}
                    </Typography>
                )}
            </div>
            {loading || !token ? (
                <Skeleton width="32px" variant="xs" />
            ) : (
                <Typography variant="xs" weight="medium" light>
                    {token.balance
                        ? formatTokenAmount({
                              amount: Number(
                                  formatUnits(token.balance, token.decimals),
                              ),
                          })
                        : "-"}
                </Typography>
            )}
        </div>
    );
}

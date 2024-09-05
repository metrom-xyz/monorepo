import { useCallback } from "react";
import { formatUnits } from "viem";
import {
    type WhitelistedErc20Token,
    type WhitelistedErc20TokenWithBalance,
} from "@metrom-xyz/sdk";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";
import { Skeleton } from "@/src/ui/skeleton";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { formatTokenAmount } from "@/src/utils/format";

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
                        ? formatTokenAmount(
                              Number(
                                  formatUnits(token.balance, token.decimals),
                              ),
                          )
                        : "-"}
                </Typography>
            )}
        </div>
    );
}

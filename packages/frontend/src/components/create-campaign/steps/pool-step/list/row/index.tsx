import type { AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useCallback } from "react";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import classNames from "classnames";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

interface PickerRowProps {
    style?: any;
    pool: AmmPoolWithTvl;
    chain: number;
    loading?: boolean;
    active?: boolean;
    onClick: (pool: AmmPoolWithTvl) => void;
}

export function Row({
    style,
    pool,
    chain,
    active,
    loading,
    onClick,
}: PickerRowProps) {
    const handlePoolOnClick = useCallback(() => {
        onClick(pool);
    }, [onClick, pool]);

    return (
        <div
            style={style}
            className={classNames(styles.root, {
                [styles.active]: active,
                [styles.loading]: loading,
            })}
            onClick={handlePoolOnClick}
        >
            <div className={styles.pool}>
                {loading ? (
                    <Skeleton circular width={36} />
                ) : (
                    <PoolRemoteLogo
                        chain={chain}
                        tokens={pool.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        }))}
                    />
                )}
                <div
                    className={classNames(styles.poolInfo, {
                        [styles.loading]: loading,
                    })}
                >
                    {loading ? (
                        <Skeleton width={64} size="sm" />
                    ) : (
                        <Typography weight="medium" size="lg" truncate>
                            {pool.tokens
                                .map((token) => token.symbol)
                                .join(" / ")}
                        </Typography>
                    )}
                    {loading ? (
                        <Skeleton width={32} size="xs" />
                    ) : pool.fee ? (
                        <Typography
                            size="xs"
                            weight="medium"
                            light
                            className={styles.fee}
                        >
                            {formatPercentage({
                                percentage: pool.fee,
                                keepDust: true,
                            })}
                        </Typography>
                    ) : null}
                </div>
            </div>
            {loading ? (
                <Skeleton width={64} size="sm" />
            ) : (
                <Typography weight="medium" size="sm" light>
                    {formatUsdAmount({ amount: pool.usdTvl })}
                </Typography>
            )}
        </div>
    );
}

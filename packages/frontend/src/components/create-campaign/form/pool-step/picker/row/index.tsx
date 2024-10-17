import type { PoolWithTvl } from "@metrom-xyz/sdk";
import { useCallback } from "react";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import classNames from "classnames";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

interface PickerRowProps {
    style?: any;
    pool: PoolWithTvl;
    chain: number;
    loading?: boolean;
    active?: boolean;
    onClick: (pool: PoolWithTvl) => void;
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
                        token0={{
                            address: pool.token0.address,
                            defaultText: pool.token0.symbol,
                        }}
                        token1={{
                            address: pool.token1.address,
                            defaultText: pool.token1.symbol,
                        }}
                    />
                )}
                <div className={styles.poolInfo}>
                    {loading ? (
                        <Skeleton width={64} variant="sm" />
                    ) : (
                        <Typography weight="medium" variant="lg" truncate>
                            {pool.token0.symbol} / {pool.token1.symbol}
                        </Typography>
                    )}
                    {loading ? (
                        <Skeleton width={32} variant="xs" />
                    ) : pool.fee ? (
                        <Typography
                            variant="xs"
                            weight="medium"
                            light
                            className={styles.fee}
                        >
                            {formatPercentage(pool.fee)}
                        </Typography>
                    ) : null}
                </div>
            </div>
            {loading ? (
                <Skeleton width={64} variant="sm" />
            ) : (
                <Typography weight="medium" variant="sm" light>
                    {formatUsdAmount(pool.usdTvl)}
                </Typography>
            )}
        </div>
    );
}

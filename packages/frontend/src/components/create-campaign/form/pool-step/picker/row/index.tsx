import type { Pool } from "@metrom-xyz/sdk";
import numeral from "numeral";
import { useCallback } from "react";
import { Typography } from "@/src/ui/typography";
import classNames from "@/src/utils/classes";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface PickerRowProps {
    style?: any;
    pool: Pool;
    chain: number;
    loading?: boolean;
    active?: boolean;
    onClick: (pool: Pool) => void;
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
                    <Skeleton circular width="36px" />
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
                        <Skeleton width="64px" variant="sm" />
                    ) : (
                        <Typography weight="medium" variant="lg">
                            {pool.token0.symbol} / {pool.token1.symbol}
                        </Typography>
                    )}
                    {loading ? (
                        <Skeleton width="32px" variant="xs" />
                    ) : pool.fee ? (
                        <Typography
                            variant="xs"
                            weight="medium"
                            light
                            className={{ root: styles.fee }}
                        >
                            {numeral(pool.fee).format("0.0[0]")}%
                        </Typography>
                    ) : null}
                </div>
            </div>
            {loading ? (
                <Skeleton width="64px" variant="sm" />
            ) : (
                <Typography weight="medium" variant="sm" light>
                    {numeral(pool.tvl).format("($ 0.00 a)")}
                </Typography>
            )}
        </div>
    );
}

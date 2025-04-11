import type { AmmPool } from "@metrom-xyz/sdk";
import { Typography, Skeleton } from "@metrom-xyz/ui";
import classNames from "classnames";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

interface PoolProps {
    pool: AmmPool;
    chain: number;
    onClick: () => void;
}

export function Pool({ pool, chain, onClick }: PoolProps) {
    return (
        <div onClick={onClick} className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    chain={chain}
                    tokens={pool.tokens.map((token) => ({
                        address: token.address,
                        defaultText: token.symbol,
                    }))}
                />
                <div className={classNames(styles.poolInfo)}>
                    <Typography weight="medium" size="lg" truncate>
                        {pool.tokens.map((token) => token.symbol).join(" / ")}
                    </Typography>
                    {pool.fee ? (
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
            <Typography weight="medium" size="sm" light>
                {formatUsdAmount({ amount: pool.usdTvl })}
            </Typography>
        </div>
    );
}

export function SkeletonPool() {
    return (
        <div className={classNames(styles.root, styles.loading)}>
            <div className={styles.pool}>
                <Skeleton circular width={36} />
                <div className={classNames(styles.poolInfo, styles.loading)}>
                    <Skeleton width={64} size="sm" />
                    <Skeleton width={32} size="xs" />
                </div>
            </div>
            <Skeleton width={64} size="sm" />
        </div>
    );
}

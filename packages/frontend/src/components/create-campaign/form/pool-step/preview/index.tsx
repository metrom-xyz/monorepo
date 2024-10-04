import type { Pool } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

export interface PoolStepPreviewProps {
    pool: Pool;
}

export function PoolStepPreview({ pool }: PoolStepPreviewProps) {
    return (
        <div className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    chain={pool.chainId}
                    token0={{
                        address: pool.token0.address,
                        defaultText: pool.token0.symbol,
                    }}
                    token1={{
                        address: pool.token1.address,
                        defaultText: pool.token1.symbol,
                    }}
                />
                <div className={styles.poolInfo}>
                    <Typography
                        weight="medium"
                        variant="lg"
                        className={styles.poolName}
                    >
                        {pool.token0.symbol} / {pool.token1.symbol}
                    </Typography>
                    {pool.fee && (
                        <Typography variant="sm" light weight="medium">
                            {formatPercentage(pool.fee)}
                        </Typography>
                    )}
                </div>
            </div>
            <Typography weight="medium" variant="sm" light>
                {formatUsdAmount(pool.tvl)}
            </Typography>
        </div>
    );
}

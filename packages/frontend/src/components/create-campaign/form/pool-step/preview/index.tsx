import numeral from "numeral";
import type { Pool } from "@metrom-xyz/sdk";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { Typography } from "@/src/ui/typography";

import styles from "./styles.module.css";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";

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
                    <Typography weight="medium" variant="lg">
                        {pool.token0.symbol} / {pool.token1.symbol}
                    </Typography>
                    {pool.fee && (
                        <Typography
                            variant="xs"
                            light
                            weight="medium"
                            className={styles.fee}
                        >
                            {formatPercentage(pool.fee)}%
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

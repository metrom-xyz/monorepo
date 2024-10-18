import type { Pool, PoolWithTvl } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

export function PoolStepPreview({
    chainId,
    token0,
    token1,
    fee,
    usdTvl,
}: PoolWithTvl) {
    return (
        <div className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    chain={chainId}
                    token0={{
                        address: token0.address,
                        defaultText: token0.symbol,
                    }}
                    token1={{
                        address: token1.address,
                        defaultText: token1.symbol,
                    }}
                />
                <div className={styles.poolInfo}>
                    <Typography
                        weight="medium"
                        variant="lg"
                        className={styles.poolName}
                    >
                        {token0.symbol} / {token1.symbol}
                    </Typography>
                    {fee && (
                        <Typography variant="sm" light weight="medium">
                            {formatPercentage(fee)}
                        </Typography>
                    )}
                </div>
            </div>
            <Typography weight="medium" variant="sm" light>
                {formatUsdAmount(usdTvl)}
            </Typography>
        </div>
    );
}

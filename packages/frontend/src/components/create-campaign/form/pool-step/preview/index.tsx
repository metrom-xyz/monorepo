import numeral from "numeral";
import type { Pool } from "@metrom-xyz/sdk";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { Typography } from "@/src/ui/typography";
import { PoolName } from "@/src/ui/pool-name";

import styles from "./styles.module.css";

export interface PoolStepPreviewProps {
    pool: Pool;
}

export function PoolStepPreview({ pool }: PoolStepPreviewProps) {
    return (
        <div className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
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
                    <PoolName pool={pool} />
                    {pool.fee && (
                        <Typography
                            variant="xs"
                            light
                            className={{ root: styles.fee }}
                        >
                            {pool.fee}%
                        </Typography>
                    )}
                </div>
            </div>
            <Typography weight="medium" variant="sm" light>
                {numeral(pool.usdTvl).format("($ 0.00 a)")}
            </Typography>
        </div>
    );
}

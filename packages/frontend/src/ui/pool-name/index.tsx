import type { Pool } from "@metrom-xyz/sdk";
import styles from "./styles.module.css";
import { Typography } from "../typography";

interface PoolNameProps {
    pool: Pool;
}

export function PoolName({ pool }: PoolNameProps) {
    return (
        <div className={styles.root}>
            <div className={styles.poolName}>
                <Typography
                    weight="medium"
                    variant="lg"
                    className={{
                        root: styles.tokenName,
                    }}
                >
                    {pool.token0.symbol}
                </Typography>
                <Typography variant="lg" light>
                    /
                </Typography>
                <Typography
                    weight="medium"
                    variant="lg"
                    className={{
                        root: styles.tokenName,
                    }}
                >
                    {pool.token1.symbol}
                </Typography>
            </div>
        </div>
    );
}

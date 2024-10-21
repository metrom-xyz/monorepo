import type { Pool, PoolWithTvl } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

export function PoolStepPreview({ chainId, tokens, fee, usdTvl }: PoolWithTvl) {
    return (
        <div className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    chain={chainId}
                    tokens={tokens.map((token) => ({
                        address: token.address,
                        defaultText: token.symbol,
                    }))}
                />
                <div className={styles.poolInfo}>
                    <Typography
                        weight="medium"
                        variant="lg"
                        className={styles.poolName}
                    >
                        {tokens.map((token) => token.symbol).join(" / ")}
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

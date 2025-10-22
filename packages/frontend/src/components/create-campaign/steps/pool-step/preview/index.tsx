import type { AmmPool } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

export function PoolStepPreview({ chainId, tokens, fee, usdTvl }: AmmPool) {
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
                        size="lg"
                        className={styles.poolName}
                    >
                        {tokens.map((token) => token.symbol).join(" / ")}
                    </Typography>
                    {fee && (
                        <Typography size="sm" variant="tertiary"weight="medium">
                            {formatPercentage({
                                percentage: fee,
                                keepDust: true,
                            })}
                        </Typography>
                    )}
                </div>
            </div>
            <Typography weight="medium" size="sm" variant="tertiary">
                {formatUsdAmount({ amount: usdTvl })}
            </Typography>
        </div>
    );
}

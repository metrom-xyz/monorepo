import type { AmmPool } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

export function PoolStepPreview({
    chainId,
    tokens,
    fee,
    usdTvl,
}: Partial<AmmPool>) {
    return (
        <div className={styles.root}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    chain={chainId}
                    tokens={
                        tokens?.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        })) || []
                    }
                />
                <div className={styles.poolInfo}>
                    <Typography
                        weight="medium"
                        size="lg"
                        className={styles.poolName}
                    >
                        {tokens?.map((token) => token.symbol).join(" / ")}
                    </Typography>
                    {fee && (
                        <Typography size="sm" light weight="medium">
                            {formatPercentage(fee)}
                        </Typography>
                    )}
                </div>
            </div>
            <Typography weight="medium" size="sm" light>
                {formatUsdAmount(usdTvl)}
            </Typography>
        </div>
    );
}

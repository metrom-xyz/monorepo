import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import type { Erc20Token } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface PoolProps {
    chainId: number;
    tokens: Erc20Token[];
    label: string;
    usdTvl: number;
    fee?: number;
    onClick?: () => void;
}

export function Pool({
    chainId,
    tokens,
    label,
    usdTvl,
    fee,
    onClick,
}: PoolProps) {
    return (
        <div className={styles.root} onClick={onClick}>
            <div className={styles.name}>
                <PoolRemoteLogo
                    size="xs"
                    chain={chainId}
                    tokens={tokens.map((token) => ({
                        address: token.address,
                        defaultText: token.symbol,
                    }))}
                />
                <Typography>{label}</Typography>
                <Typography size="xs" variant="tertiary" className={styles.fee}>
                    {formatPercentage({
                        percentage: fee,
                        keepDust: true,
                    })}
                </Typography>
            </div>
            <Typography size="sm" variant="secondary">
                {formatUsdAmount({ amount: usdTvl })}
            </Typography>
        </div>
    );
}

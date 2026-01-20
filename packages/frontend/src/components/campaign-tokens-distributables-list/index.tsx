import { RemoteLogo } from "../remote-logo";
import { Typography } from "@metrom-xyz/ui";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import type { TokenDistributable } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface CampaignTokensDistributablesListProps {
    chain: number;
    distributables: TokenDistributable[];
}

export function CampaignTokensDistributablesList({
    chain,
    distributables,
}: CampaignTokensDistributablesListProps) {
    return (
        <div className={styles.root}>
            {distributables.map(({ amount, token }) => (
                <div key={token.address} className={styles.row}>
                    <div className={styles.tokenWrapper}>
                        <RemoteLogo
                            size="xs"
                            address={token.address}
                            chain={chain}
                        />
                        <Typography size="sm" weight="medium">
                            {token.symbol}
                        </Typography>
                    </div>
                    <div>
                        <Typography size="sm" weight="medium">
                            {formatAmount({
                                amount: amount.formatted,
                            })}
                        </Typography>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {formatUsdAmount({
                                amount: amount.usdValue,
                            })}
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    );
}

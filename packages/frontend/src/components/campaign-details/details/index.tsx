import { TextField } from "@metrom-xyz/ui";
import { formatUsdAmount } from "@/src/utils/format";
import type { Campaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface DetailsProps {
    campaign?: Campaign;
    loading: boolean;
}

export function Details({ campaign, loading }: DetailsProps) {
    const detailsLoading = loading || !campaign;
    const targetUsdValue = campaign?.usdTvl;

    return (
        <div className={styles.root}>
            <div className={styles.topContent}>
                {targetUsdValue !== undefined && (
                    <TextField
                        boxed
                        size="xl"
                        label={campaign?.targetValueName || ""}
                        loading={detailsLoading}
                        value={formatUsdAmount({
                            amount: targetUsdValue,
                            cutoff: false,
                        })}
                    />
                )}
            </div>
        </div>
    );
}

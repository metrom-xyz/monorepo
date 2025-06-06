import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import { type TargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface AmmPoolLiquidityProps {
    campaign: TargetedNamedCampaign<TargetType.AmmPoolLiquidity>;
}

export function AmmPoolLiquidity({ campaign }: AmmPoolLiquidityProps) {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
                {campaign.target.pool.fee && (
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.campaignFee}
                        light
                    >
                        {formatPercentage({
                            percentage: campaign.target.pool.fee,
                            keepDust: true,
                        })}
                    </Typography>
                )}
            </div>
        </div>
    );
}

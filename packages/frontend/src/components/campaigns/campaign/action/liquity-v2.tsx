import { Typography } from "@metrom-xyz/ui";
import { type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface LiquityV2Props<T extends LiquityV2TargetType> {
    campaign: TargetedNamedCampaign<T>;
}

export function LiquidityV2<T extends LiquityV2TargetType>({
    campaign,
}: LiquityV2Props<T>) {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
            </div>
        </div>
    );
}

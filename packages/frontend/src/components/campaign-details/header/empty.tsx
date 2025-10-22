import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface EmptyHeaderProps {
    campaign: TargetedNamedCampaign<TargetType.Empty>;
}

export function EmptyHeader({ campaign }: EmptyHeaderProps) {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <Typography size="xl3" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
            </div>
        </div>
    );
}

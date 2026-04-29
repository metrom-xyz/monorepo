import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    TargetedNamedCampaign,
    CampaignDetails,
} from "@/src/types/campaign/common";

import styles from "./styles.module.css";

interface EmptyHeaderProps {
    campaignDetails: TargetedNamedCampaign<TargetType.Empty, CampaignDetails>;
}

export function EmptyHeader({ campaignDetails }: EmptyHeaderProps) {
    return (
        <div className={styles.titleContainer}>
            <div className={styles.title}>
                <Typography size="xl3" weight="medium">
                    {campaignDetails.name}
                </Typography>
            </div>
        </div>
    );
}

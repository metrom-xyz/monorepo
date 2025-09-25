import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface EmptyHeaderProps {
    campaign: TargetedNamedCampaign<TargetType.Empty>;
}

export function EmptyHeader({ campaign }: EmptyHeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
            </div>
        </div>
    );
}

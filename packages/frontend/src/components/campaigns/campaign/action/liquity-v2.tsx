import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { RestrictionType, type LiquityV2TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface LiquityV2Props<T extends LiquityV2TargetType> {
    campaign: TargetedNamedCampaign<T>;
}

export function LiquidityV2<T extends LiquityV2TargetType>({
    campaign,
}: LiquityV2Props<T>) {
    const t = useTranslations("allCampaigns");

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {campaign.name}
                </Typography>
                {campaign.specification?.kpi && (
                    <div className={styles.chip}>
                        <Typography size="sm" weight="medium" uppercase>
                            {t("kpi")}
                        </Typography>
                    </div>
                )}
                {campaign.restrictions?.type === RestrictionType.Whitelist && (
                    <div className={styles.chip}>
                        <Typography size="xs" weight="medium" uppercase>
                            {t("restricted")}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

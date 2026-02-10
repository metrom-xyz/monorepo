import type { TargetType } from "@metrom-xyz/sdk";
import type { ActionSizes } from ".";
import type { TargetedNamedCampaign } from "@/src/types/campaign";
import { Typography } from "@metrom-xyz/ui";
import { CampaignTag } from "@/src/components/campaign-tag";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { YIELDSEEKER_BONUS_PERCENTAGE } from "@/src/commons";

import styles from "./styles.module.css";

interface YieldSeekerProps<T extends TargetType.YieldSeeker>
    extends ActionSizes {
    campaign: TargetedNamedCampaign<T>;
}

export function YieldSeeker<T extends TargetType.YieldSeeker>({
    nameSize,
    campaign,
}: YieldSeekerProps<T>) {
    const t = useTranslations("allCampaigns.yieldSeeker");

    return (
        <>
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
            <div className={styles.tags}>
                <div className={styles.yieldSeekerBoostTag}>
                    <CampaignTag
                        text={t("boost", {
                            percentage: formatPercentage({
                                percentage: YIELDSEEKER_BONUS_PERCENTAGE,
                            }),
                        })}
                    />
                </div>
            </div>
        </>
    );
}

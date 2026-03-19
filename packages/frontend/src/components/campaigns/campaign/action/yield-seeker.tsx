import type { TargetType } from "@metrom-xyz/sdk";
import type { ActionSizes } from ".";
import type { Campaign, TargetedNamedCampaign } from "@/src/types/campaign";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { YIELDSEEKER_BONUS_PERCENTAGE } from "@/src/commons";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface YieldSeekerProps<
    T extends TargetType.YieldSeeker,
> extends ActionSizes {
    campaign: TargetedNamedCampaign<T, Campaign>;
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
                    <div>
                        <Typography size="xs" weight="medium" uppercase>
                            {t("boost", {
                                percentage: formatPercentage({
                                    percentage: YIELDSEEKER_BONUS_PERCENTAGE,
                                }),
                            })}
                        </Typography>
                    </div>
                </div>
            </div>
        </>
    );
}

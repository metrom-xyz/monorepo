import type { Campaign } from "@/src/types/campaign/common";
import { CampaignTag } from "@/src/components/campaign-tag";
import { useTranslations } from "next-intl";
import { CalendarIcon } from "@/src/assets/calendar-icon";
import { ErrorText, Skeleton, Typography } from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import { Status } from "../../status";
import { RestrictionType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface TagsProps {
    campaign: Campaign;
}

export function Tags({ campaign }: TagsProps) {
    const t = useTranslations("campaignDetails.header");

    const { specification, restrictions, from, to } = campaign;

    return (
        <div className={styles.root}>
            {specification?.kpi && (
                <CampaignTag
                    size="sm"
                    text={t("kpi")}
                    className={styles.campaignTag}
                />
            )}
            {specification?.priceRange && (
                <CampaignTag
                    size="sm"
                    text={t("range")}
                    className={styles.campaignTag}
                />
            )}
            <div className={styles.tag}>
                <CalendarIcon className={styles.calendarIcon} />
                <Typography size="sm" weight="medium" uppercase>
                    {`${formatDateTime(from)} - ${formatDateTime(to)}`}
                </Typography>
            </div>
            <Status
                size="sm"
                from={campaign.from}
                to={campaign.to}
                status={campaign.status}
            />
            {restrictions &&
                restrictions.type === RestrictionType.Whitelist && (
                    <div className={styles.restrictions}>
                        <ErrorText
                            mountAnimation={false}
                            level="warning"
                            size="sm"
                            weight="medium"
                        >
                            {t("allowlist")}
                        </ErrorText>
                    </div>
                )}
        </div>
    );
}

export function SkeletonTags() {
    return (
        <div className={styles.root}>
            <Skeleton width={80} height={24} />
            <Skeleton width={200} height={24} />
        </div>
    );
}

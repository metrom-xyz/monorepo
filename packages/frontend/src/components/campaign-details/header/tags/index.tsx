import type { CampaignDetails } from "@/src/types/campaign/common";
import { CampaignTag } from "@/src/components/campaign-tag";
import { useTranslations } from "next-intl";
import { CalendarIcon } from "@/src/assets/calendar-icon";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import { CampaignStatus } from "../../../campaign-status";
import { ElementPlusIcon } from "@/src/assets/element-plus-icon";

import styles from "./styles.module.css";

interface TagsProps {
    campaignDetails: CampaignDetails;
}

export function Tags({ campaignDetails }: TagsProps) {
    const t = useTranslations("campaignDetails.header");
    const { status, from, to, opportunitiesAmount } = campaignDetails;

    return (
        <div className={styles.root}>
            {opportunitiesAmount > 1 && (
                <CampaignTag
                    variant="secondary"
                    text={
                        <div className={styles.tag}>
                            <ElementPlusIcon
                                className={styles.elementPlusIcon}
                            />
                            <Typography size="sm" weight="medium">
                                {t("groupedTarget")}
                            </Typography>
                        </div>
                    }
                />
            )}
            {opportunitiesAmount === 1 && (
                <CampaignTag
                    variant="secondary"
                    text={
                        <div className={styles.tag}>
                            <CalendarIcon className={styles.calendarIcon} />
                            <Typography size="sm" weight="medium">
                                {`${formatDateTime(from)} - ${formatDateTime(to)}`}
                            </Typography>
                        </div>
                    }
                />
            )}
            <CampaignStatus tag from={from} to={to} status={status} />
        </div>
    );
}

export function SkeletonTags() {
    return (
        <div className={styles.root}>
            <Skeleton width={80} height={28} />
            <Skeleton width={200} height={28} />
        </div>
    );
}

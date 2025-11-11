import { useActivities } from "@/src/hooks/useActivities";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { ActivitiesGroup, SkeletonActivitiesGroup } from "./activities-group";
import { CalendarRemoveIcon } from "@/src/assets/calendar-remove-icon";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface ActivitiesProps {
    chainId: number;
}

export function Activities({ chainId }: ActivitiesProps) {
    const t = useTranslations("accountMenu.activities");

    const chainSupported = useIsChainSupported({ chainId });

    const { loading, activities } = useActivities({
        enabled: chainSupported,
    });

    // TODO: add illustration
    if (!loading && (!chainSupported || activities.length === 0))
        return (
            <div className={styles.empty}>
                <CalendarRemoveIcon />
                <div className={styles.emptyTextWrapper}>
                    <Typography uppercase weight="medium" size="sm">
                        {t("empty.title")}
                    </Typography>
                    <Typography size="sm" variant="tertiary">
                        {t("empty.description")}
                    </Typography>
                </div>
            </div>
        );

    return (
        <div className={styles.root}>
            {loading ? (
                <>
                    <SkeletonActivitiesGroup />
                    <SkeletonActivitiesGroup />
                    <SkeletonActivitiesGroup />
                </>
            ) : (
                activities.map((activity, i) => {
                    return (
                        <ActivitiesGroup
                            key={i}
                            chainId={chainId}
                            {...activity}
                        />
                    );
                })
            )}
        </div>
    );
}

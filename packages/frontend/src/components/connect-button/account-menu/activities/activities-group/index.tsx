import type { GroupedActivities } from "@/src/hooks/useActivities";
import { PlusCircleIcon } from "@/src/assets/plus-circle-icon";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { Activity, SkeletonActivity } from "../activity";
import { formatDate } from "@/src/utils/format";

import styles from "./styles.module.css";
import classNames from "classnames";

interface ActivitiesGroupProps extends GroupedActivities {
    chainId: number;
}

export function ActivitiesGroup({
    chainId,
    timestamp,
    activities,
}: ActivitiesGroupProps) {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.timelineDot}>
                    <PlusCircleIcon className={styles.timelineDotIcon} />
                </div>
                <Typography variant="tertiary" size="sm">
                    {formatDate(timestamp)}
                </Typography>
            </div>
            <div className={styles.content}>
                <div className={styles.timeline}></div>
                <div className={styles.activities}>
                    {activities.map((activity, index) => (
                        <Activity
                            key={`${activity.transaction.id}-${index}`}
                            chainId={chainId}
                            {...activity}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SkeletonActivitiesGroup() {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={classNames(styles.timelineDot, styles.loading)}>
                    <Skeleton size="sm" circular width={20} />
                </div>
                <Skeleton size="sm" width={120} />
            </div>
            <div className={styles.content}>
                <div
                    className={classNames(styles.timeline, styles.loading)}
                ></div>
                <div className={styles.activities}>
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                </div>
            </div>
        </div>
    );
}

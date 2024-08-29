import { useActivities } from "@/src/hooks/useActivities";
import { Activity, SkeletonActivity } from "./activity";

import styles from "./styles.module.css";

interface ActivitiesProps {
    chainId: number;
}

export function Activities({ chainId }: ActivitiesProps) {
    const { loading, activities } = useActivities();

    return (
        <div className={styles.root}>
            {loading ? (
                <>
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                </>
            ) : (
                activities.map((activity, i) => {
                    return <Activity key={i} chainId={chainId} {...activity} />;
                })
            )}
        </div>
    );
}

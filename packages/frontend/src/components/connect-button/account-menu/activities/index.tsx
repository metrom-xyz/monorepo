import { useActivities } from "@/src/hooks/useActivities";
import { Activity, SkeletonActivity } from "./activity";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";

import styles from "./styles.module.css";

interface ActivitiesProps {
    chainId: number;
}

export function Activities({ chainId }: ActivitiesProps) {
    const chainSupported = useIsChainSupported({ chainId });

    const { loading, activities } = useActivities({
        enabled: chainSupported,
    });

    // TODO: add illustration
    if (!loading && (!chainSupported || activities.length === 0))
        return <div className={styles.root}></div>;

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

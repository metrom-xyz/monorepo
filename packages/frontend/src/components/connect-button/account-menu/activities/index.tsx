import { useActivities } from "@/src/hooks/useActivities";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";
import { ActivitiesGroup, SkeletonActivitiesGroup } from "./activities-group";

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

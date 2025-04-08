import { useActivities } from "@/src/hooks/useActivities";
import { Activity, SkeletonActivity } from "./activity";
import { useMemo } from "react";
import { useChains } from "wagmi";

import styles from "./styles.module.css";

interface ActivitiesProps {
    chainId: number;
}

export function Activities({ chainId }: ActivitiesProps) {
    const chains = useChains();
    const unsupportedChain = useMemo(() => {
        return !chains.some((chain) => chain.id === chainId);
    }, [chains, chainId]);

    const { loading, activities } = useActivities({
        enabled: !unsupportedChain,
    });

    // TODO: add illustration
    if (!loading && (unsupportedChain || activities.length === 0))
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

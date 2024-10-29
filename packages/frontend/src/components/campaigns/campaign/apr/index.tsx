"use client";

import { Skeleton } from "@metrom-xyz/ui";
import { AprChip } from "@/src/components/apr-chip";

import styles from "./styles.module.css";

interface AprProps {
    apr: number | null;
    kpi?: boolean;
}

export function Apr({ apr, kpi }: AprProps) {
    return (
        <div className={styles.root}>
            <AprChip apr={apr} kpi={kpi} placeholder fill />
        </div>
    );
}

export function SkeletonApr() {
    return <Skeleton className={styles.skeleton} variant="lg" />;
}

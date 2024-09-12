"use client";

import { Typography, Skeleton } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AprProps {
    apr: number | null;
}

export function Apr({ apr }: AprProps) {
    return apr ? (
        <div className={styles.root}>
            <Typography weight="medium" className={styles.text}>
                {formatPercentage(apr)}
            </Typography>
        </div>
    ) : (
        <Typography className={styles.emptyAPR} weight="medium">
            -
        </Typography>
    );
}

export function SkeletonApr() {
    return <Skeleton className={styles.emptyAPR} variant="lg" width={60} />;
}

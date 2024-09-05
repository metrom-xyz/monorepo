"use client";

import { Typography } from "@/src/ui/typography";
import { Skeleton } from "@/src/ui/skeleton";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AprProps {
    apr: number | null;
}

export function Apr({ apr }: AprProps) {
    return apr ? (
        <div className={styles.root}>
            <Typography weight="medium" className={styles.text}>
                {formatPercentage(apr)}%
            </Typography>
        </div>
    ) : (
        <Typography weight="medium">-</Typography>
    );
}

export function SkeletonApr() {
    return <Skeleton variant="lg" width={60} />;
}

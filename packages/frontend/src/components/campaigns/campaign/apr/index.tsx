"use client";

import { Typography } from "@/src/ui/typography";
import { formatDecimals } from "@metrom-xyz/sdk";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface AprProps {
    apr: number | null;
}

export function Apr({ apr }: AprProps) {
    return apr ? (
        <div className={styles.root}>
            <Typography weight="medium">
                {formatDecimals({
                    number: apr.toString(),
                })}
                %
            </Typography>
        </div>
    ) : (
        <Typography weight="medium">-</Typography>
    );
}

export function SkeletonApr() {
    return <Skeleton variant="lg" width={60} />;
}

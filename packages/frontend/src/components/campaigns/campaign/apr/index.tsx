"use client";

import { Typography } from "@/src/ui/typography";
import { Skeleton } from "@/src/ui/skeleton";
import numeral from "numeral";

import styles from "./styles.module.css";

interface AprProps {
    apr: number | null;
}

export function Apr({ apr }: AprProps) {
    return apr ? (
        <div className={styles.root}>
            <Typography weight="medium" className={styles.text}>
                {numeral(apr).format("0.[0]a")}%
            </Typography>
        </div>
    ) : (
        <Typography className={styles.emptyAPR} weight="medium">
            -
        </Typography>
    );
}

export function SkeletonApr() {
    return <Skeleton variant="lg" width={60} />;
}

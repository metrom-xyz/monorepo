"use client";

import { Skeleton } from "@metrom-xyz/ui";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = CHAIN_DATA[id as SupportedChain].icon;

    return (
        <div className={styles.root}>
            <ChainIcon className={styles.icon} />
        </div>
    );
}

export function SkeletonChain() {
    return (
        <div className={styles.root}>
            <Skeleton circular className={styles.icon} />
        </div>
    );
}

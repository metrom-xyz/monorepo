"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_ICONS } from "@/src/commons";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = SUPPORTED_CHAIN_ICONS[id as SupportedChain];

    return (
        <div className={styles.root}>
            <ChainIcon className={styles.icon} />
        </div>
    );
}

export function SkeletonChain() {
    return <Skeleton className={styles.root} />;
}

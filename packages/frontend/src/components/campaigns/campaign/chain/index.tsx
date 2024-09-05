"use client";

import { Skeleton } from "@/src/ui/skeleton";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = CHAIN_DATA[id as SupportedChain].icon;

    return <ChainIcon className={styles.root} />;
}

export function SkeletonChain() {
    return <Skeleton circular className={styles.root} />;
}

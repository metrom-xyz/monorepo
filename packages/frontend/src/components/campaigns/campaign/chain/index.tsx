"use client";

import { Skeleton } from "@/src/ui/skeleton";
import { useChainData } from "@/src/hooks/useChainData";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = useChainData().icon;

    return <ChainIcon className={styles.root} />;
}

export function SkeletonChain() {
    return <Skeleton circular className={styles.root} />;
}

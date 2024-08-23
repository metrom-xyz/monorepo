"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_ICONS } from "@/src/commons";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = SUPPORTED_CHAIN_ICONS[id as SupportedChain];

    return <ChainIcon className={styles.root} />;
}

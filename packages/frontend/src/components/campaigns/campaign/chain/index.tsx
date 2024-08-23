"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import styles from "./styles.module.css";
import { SUPPORTED_CHAIN_ICONS } from "@/src/commons";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const ChainIcon = SUPPORTED_CHAIN_ICONS[id as SupportedChain];

    return <ChainIcon className={styles.root} />;
}

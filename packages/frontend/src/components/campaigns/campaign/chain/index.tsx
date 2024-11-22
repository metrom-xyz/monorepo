import { useChainData } from "@/src/hooks/useChainData";
import { Skeleton } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface ChainProps {
    id: number;
}

export function Chain({ id }: ChainProps) {
    const chainData = useChainData(id);
    const ChainIcon = chainData?.icon;

    return (
        <div className={styles.root}>
            {ChainIcon && <ChainIcon className={styles.icon} />}
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

import { Card, Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

const PLACEHOLDER = new Array(3).fill(null);

export function LoadingChains() {
    return (
        <Card className={styles.root}>
            <Skeleton width={60} className={styles.header} />
            {PLACEHOLDER.map((_, i) => {
                return (
                    <div key={i} className={styles.row}>
                        <Skeleton className={styles.chainIcon} />
                        <Skeleton width={70} />
                    </div>
                );
            })}
        </Card>
    );
}

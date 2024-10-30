import { Card, Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

export function LoadingChainOverview() {
    return (
        <Card className={styles.root}>
            <div className={styles.chainNameWrapper}>
                <Skeleton className={styles.chainIcon} />
                <Skeleton width={100} variant="xl2" />
            </div>
            <Skeleton width={56} variant="xl3" />
        </Card>
    );
}

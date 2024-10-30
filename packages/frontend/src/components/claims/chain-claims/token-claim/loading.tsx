import { Card, Skeleton } from "@metrom-xyz/ui/server";

import styles from "./styles.module.css";

export function LoadingTokenClaim() {
    return (
        <Card className={styles.root}>
            <div className={styles.leftWrapper}>
                <Skeleton circular width={28} />
                <Skeleton width={60} variant="lg" />
                <Skeleton width={70} variant="lg" />
            </div>
            <Skeleton width={56} className={styles.skeletonButton} />
        </Card>
    );
}

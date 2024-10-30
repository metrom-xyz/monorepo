import { Skeleton } from "@metrom-xyz/ui/server";
import classNames from "classnames";

import styles from "./styles.module.css";

export function LoadingHeader() {
    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <div className={styles.loadingLogosWrapper}>
                        <Skeleton
                            circular
                            width={44}
                            className={styles.loadingLogo}
                        />
                        <Skeleton
                            circular
                            width={44}
                            className={styles.loadingLogo}
                        />
                    </div>
                    <Skeleton variant="xl2" width={400} />
                    <Skeleton variant="lg" width={60} />
                </div>
                <Skeleton width={125} />
            </div>
            <div className={styles.actionsContainer}>
                <div className={classNames(styles.leftActions, styles.loading)}>
                    <Skeleton variant="xl3" width={112} />
                    <Skeleton variant="xl3" width={112} />
                    <Skeleton variant="xl3" width={112} />
                </div>
            </div>
        </div>
    );
}

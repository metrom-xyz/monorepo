import { LoadingChainClaims } from "./chain-claims/loading";
import { LoadingChainOverview } from "./chain-overview/loading";
import { LoadingChains } from "./chains/loading";

import styles from "./styles.module.css";

export function LoadingClaims() {
    return (
        <div className={styles.root}>
            <LoadingChains />
            <div className={styles.rightWrapper}>
                <LoadingChainOverview />
                <LoadingChainClaims />
            </div>
        </div>
    );
}

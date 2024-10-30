import { LoadingDetails } from "./details/loading";
import { LoadingHeader } from "./header/loading";
import { LoadingLeaderboard } from "./leaderboard/loading";
import { LoadingRewards } from "./rewards/loading";

import styles from "./styles.module.css";

export function LoadingCampaignDetails() {
    return (
        <div className={styles.root}>
            <div className={styles.headerWrapper}>
                <LoadingHeader />
            </div>
            <div className={styles.contentWrapper}>
                <LoadingDetails />
                <LoadingRewards />
                <LoadingLeaderboard />
            </div>
        </div>
    );
}

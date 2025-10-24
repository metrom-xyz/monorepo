import classNames from "classnames";
import { BackendCampaignType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface SkeletonCampaignsProps {
    type: BackendCampaignType;
}

export function SkeletonCampaigns({ type }: SkeletonCampaignsProps) {
    return (
        <div className={styles.root}>
            <div className={styles.scrollContainer}>
                <div className={styles.tableWrapper}>
                    <div
                        className={classNames(styles.table, {
                            [styles[type]]: true,
                        })}
                    >
                        <div className={styles.header}>
                            {Array.from({
                                length:
                                    type === BackendCampaignType.Rewards
                                        ? 7
                                        : 6,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className={styles.headerSkeleton}
                                />
                            ))}
                        </div>
                        <div className={styles.body}>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={styles.campaignSkeleton}
                                >
                                    <div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

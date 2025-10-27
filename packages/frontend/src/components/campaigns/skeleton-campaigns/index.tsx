import classNames from "classnames";
import { BackendCampaignType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface SkeletonCampaignsProps {
    type: BackendCampaignType;
}

export function SkeletonCampaigns({ type }: SkeletonCampaignsProps) {
    return (
        <div className={styles.root}>
            <div className={styles.tabs} />
            <div className={styles.wrapper}>
                <div className={styles.filters} />
                <div className={styles.tableWrapper}>
                    <div
                        className={classNames(styles.table, {
                            [styles[type]]: true,
                        })}
                    >
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

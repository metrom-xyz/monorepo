import classNames from "classnames";
import { BackendCampaignType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface SkeletonCampaignsProps {
    type: BackendCampaignType;
    hideHeader?: boolean;
}

export function SkeletonCampaigns({
    type,
    hideHeader = false,
}: SkeletonCampaignsProps) {
    return (
        <div className={styles.root}>
            {!hideHeader && (
                <div className={styles.header}>
                    <div className={styles.title}></div>
                    <div className={styles.subtitle}></div>
                </div>
            )}
            <div>
                <div className={styles.tabs}>
                    <div className={styles.tab} />
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.filters} />
                    <div className={styles.tableWrapper}>
                        <div
                            className={classNames(styles.table, {
                                [styles[type]]: true,
                            })}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

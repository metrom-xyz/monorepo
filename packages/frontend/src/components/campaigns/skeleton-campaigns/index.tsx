import classNames from "classnames";

import styles from "./styles.module.css";

export function SkeletonCampaigns() {
    return (
        <div className={styles.root}>
            <div className={styles.filters}>
                <div className={styles.filterInput}></div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className={styles.inputWithLabel}>
                        <div className={styles.label} />
                        <div
                            className={classNames(styles.filterInput, {
                                [styles.last]: index === 2,
                            })}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.scrollContainer}>
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        <div className={styles.header}>
                            {Array.from({ length: 6 }).map((_, index) => (
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

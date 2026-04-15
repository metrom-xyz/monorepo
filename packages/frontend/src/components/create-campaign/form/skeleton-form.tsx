import styles from "./styles.module.css";

export function SkeletonForm() {
    return (
        <div className={styles.root}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.content}>
                <div className={styles.form}>
                    <div className={styles.skeletonText}></div>
                    <div className={styles.skeletonStepsWrapper}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className={styles.skeletonStep}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className={styles.skeletonPreview}></div>
            </div>
        </div>
    );
}

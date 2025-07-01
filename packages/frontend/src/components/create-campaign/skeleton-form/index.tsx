import styles from "./styles.module.css";

export function SkeletonForm() {
    return (
        <div className={styles.root}>
            {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className={styles.step}></div>
            ))}
        </div>
    );
}

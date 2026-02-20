import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

export function SkeletonPickDistributablesType() {
    return (
        <div className={styles.root}>
            <div className={styles.navigation}>
                <div className={styles.skeleton} />
                <div className={styles.skeleton} />
            </div>
            <div className={styles.header}>
                <div className={styles.skeleton} />
                <div className={styles.skeleton} />
            </div>
            <div className={commonStyles.cardsWrapper}>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
            </div>
        </div>
    );
}

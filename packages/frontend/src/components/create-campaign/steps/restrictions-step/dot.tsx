import classNames from "classnames";

import styles from "./styles.module.css";

interface DotProps {
    color: "green" | "red";
}

export function Dot({ color }: DotProps) {
    return (
        <div className={styles.dotWrapper}>
            <div
                className={classNames(styles.dot, { [styles[color]]: true })}
            ></div>
        </div>
    );
}

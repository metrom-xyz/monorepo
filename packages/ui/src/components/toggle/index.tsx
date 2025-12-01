import { easeInOut, motion } from "motion/react";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface ToggleProps {
    size?: "xs" | "sm" | "lg";
    disabled?: boolean;
    tabIndex?: number;
    checked?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

export function Toggle({
    size = "sm",
    disabled,
    tabIndex,
    checked,
    onClick,
    className,
}: ToggleProps) {
    return (
        <div
            tabIndex={tabIndex}
            onClick={onClick}
            className={classNames(styles.root, className, {
                [styles.disabled]: disabled,
                [styles.checked]: checked,
                [styles[size]]: true,
            })}
        >
            <motion.div
                initial={false}
                animate={{
                    left: checked ? "auto" : "0.130rem",
                    right: checked ? "0.130rem" : "auto",
                }}
                transition={{
                    ease: easeInOut,
                    duration: 0.2,
                }}
                className={classNames("circle", styles.circle, {
                    [styles[size]]: true,
                })}
            ></motion.div>
        </div>
    );
}

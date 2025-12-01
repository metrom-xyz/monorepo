import type { ReactNode } from "react";
import classNames from "classnames";
import { easeInOut, motion } from "motion/react";

import styles from "./styles.module.css";

export interface SwitchOptionProps<T> {
    id?: string;
    value: T;
    active?: T;
    children?: ReactNode;
    onClick?: (value: T) => void;
    className?: string;
}

export function SwitchOption<T>({
    id,
    value,
    active,
    children,
    onClick,
    className,
}: SwitchOptionProps<T>) {
    function handleOnClick() {
        if (onClick) onClick(value);
    }

    return (
        <div
            onClick={handleOnClick}
            className={classNames("root", styles.root, className)}
        >
            {active === value ? (
                <motion.div
                    layoutId={`${id}_background`}
                    transition={{ ease: easeInOut, duration: 0.2 }}
                    className={styles.background}
                />
            ) : null}

            <div
                className={classNames("option", styles.optionWrapper, {
                    [styles.active]: active === value,
                })}
            >
                {children}
            </div>
        </div>
    );
}

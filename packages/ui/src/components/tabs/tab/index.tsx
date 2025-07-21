import { useCallback, type ReactNode } from "react";
import classNames from "classnames";
import type { TabsSize } from "..";

import styles from "./styles.module.css";

export interface TabProps<T> {
    onClick?: (value: T) => void;
    size?: TabsSize;
    active?: T;
    value: T;
    children?: ReactNode;
    className?: string;
}

export function Tab<T>({
    onClick,
    size = "base",
    active,
    value,
    children,
    className,
}: TabProps<T>) {
    const handleOnClick = useCallback(() => {
        if (onClick && value !== active) onClick(value);
    }, [active, value, onClick]);

    return (
        <div
            className={classNames(styles.root, className, {
                [styles.active]: value === active,
                [styles[size]]: true,
            })}
            onClick={handleOnClick}
        >
            {children}
        </div>
    );
}

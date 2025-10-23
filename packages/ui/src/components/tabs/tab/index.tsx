import type { FunctionComponent, ReactNode, SVGProps } from "react";
import classNames from "classnames";
import type { TabsSize } from "..";

import styles from "./styles.module.css";

export interface TabProps<T> {
    onClick?: (value: T) => void;
    size?: TabsSize;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    active?: T;
    value: T;
    children?: ReactNode;
    className?: string;
}

export function Tab<T>({
    onClick,
    size = "base",
    icon: Icon,
    active,
    value,
    children,
    className,
}: TabProps<T>) {
    function handleOnClick() {
        if (onClick) onClick(value);
    }

    return (
        <div
            onClick={handleOnClick}
            className={classNames("root", styles.root, className, {
                [styles.active]: value === active,
                [styles[size]]: true,
            })}
        >
            {Icon && (
                <Icon
                    className={classNames("icon", styles.icon, {
                        [styles[size]]: true,
                    })}
                />
            )}
            {children}
        </div>
    );
}

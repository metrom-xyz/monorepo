import { Children, cloneElement, type ReactElement } from "react";
import classNames from "classnames";
import { matchChildByType } from "../../utils/components";
import { Tab, type TabProps } from "./tab";

import styles from "./styles.module.css";

export type TabsSize = "xs" | "sm" | "base" | "lg" | "xl";

export interface TabsProps<T> {
    onChange: (value: T) => void;
    size?: TabsSize;
    value?: T;
    children: ReactElement[];
    className?: string;
}

export function Tabs<T>({
    onChange,
    size = "base",
    value,
    children,
    className,
}: TabsProps<T>) {
    const childrenArray = Children.toArray(children);
    const tabsChildren = childrenArray.filter((child) =>
        matchChildByType(child, Tab),
    ) as ReactElement[];

    function handleOnChange(value: T) {
        onChange(value);
    }

    return (
        <div
            className={classNames(styles.root, className, {
                [styles[size]]: true,
            })}
        >
            {Children.map(tabsChildren, (child) =>
                cloneElement<TabProps<T>>(child, {
                    ...child.props,
                    size,
                    active: value,
                    onClick: handleOnChange,
                }),
            )}
        </div>
    );
}

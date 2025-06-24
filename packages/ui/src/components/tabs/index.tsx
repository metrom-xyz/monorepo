import React, { useCallback, type ReactElement } from "react";
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
    const handleOnChange = useCallback(
        (newValue: T) => {
            if (value === newValue) return;
            onChange(newValue);
        },
        [value],
    );

    return (
        <div
            className={classNames(styles.root, className, {
                [styles[size]]: true,
            })}
        >
            {React.Children.map(children, (child) => {
                return matchChildByType<TabProps<T>>(child, Tab)
                    ? React.cloneElement(child, {
                          ...child.props,
                          size,
                          active: value,
                          onClick: handleOnChange,
                      })
                    : null;
            })}
        </div>
    );
}

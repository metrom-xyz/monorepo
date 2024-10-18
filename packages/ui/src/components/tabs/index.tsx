import { Children, cloneElement, type ReactElement } from "react";
import classNames from "classnames";
import { matchChildByType } from "../../utils/components";
import { Tab, type TabProps } from "./tab";

import styles from "./styles.module.css";

export interface TabsProps<T> {
    onChange: (value: T) => void;
    value?: T;
    children: ReactElement[];
    className?: string;
}

export function Tabs<T>({
    onChange,
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
        <div className={classNames(styles.root, className)}>
            {Children.map(tabsChildren, (child) =>
                cloneElement<TabProps<T>>(child, {
                    ...child.props,
                    active: value,
                    onClick: handleOnChange,
                }),
            )}
        </div>
    );
}

import React, {
    type FunctionComponent,
    type ReactElement,
    type ReactNode,
    type SVGProps,
} from "react";
import classNames from "classnames";
import { matchChildByType } from "../../utils/components";
import { Tab } from "./tab";
import { UnderlinedTab } from "./underlined-tab";

import styles from "./styles.module.css";

export type TabsSize = "xs" | "sm" | "base" | "lg" | "xl";

export interface TabsProps<T> {
    onChange: (value: T) => void;
    size?: TabsSize;
    value?: T;
    children: ReactElement[] | ReactElement;
    className?: string;
}

export interface TabProps<T> {
    onClick?: (value: T) => void;
    size?: TabsSize;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    active?: T;
    value: T;
    children?: ReactNode;
    className?: string;
}

export function Tabs<T>({
    onChange,
    size = "base",
    value,
    children,
    className,
}: TabsProps<T>) {
    function handleOnChange(value: T) {
        onChange(value);
    }

    return (
        <div className={classNames(styles.tabs, className)}>
            {React.Children.map(children, (child) => {
                return matchChildByType<TabProps<T>>(child, Tab) ||
                    matchChildByType<TabProps<T>>(child, UnderlinedTab)
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

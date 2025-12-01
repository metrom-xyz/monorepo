import classNames from "classnames";
import React, { useId, type ReactElement } from "react";
import { matchChildByType } from "../../utils/components";
import { SwitchOption, type SwitchOptionProps } from "./switch-option";

import styles from "./styles.module.css";

export interface SwitchProps<T> {
    id?: string;
    size?: "xs" | "sm" | "lg";
    disabled?: boolean;
    tabIndex?: number;
    value?: T;
    onChange: (value: T) => void;
    className?: string;
    children: [ReactElement, ReactElement];
}

export function Switch<T>({
    id,
    size = "sm",
    disabled,
    tabIndex,
    value,
    onChange,
    className,
    children,
}: SwitchProps<T>) {
    const generatedId = useId();
    const resolvedId = id || generatedId;

    function handleOnChange(value: T) {
        onChange(value);
    }

    return (
        <div
            tabIndex={tabIndex}
            className={classNames(styles.root, className, {
                [styles.disabled]: disabled,
                [styles[size]]: true,
            })}
        >
            {React.Children.map(children, (child) => {
                return matchChildByType<SwitchOptionProps<T>>(
                    child,
                    SwitchOption,
                )
                    ? React.cloneElement(child, {
                          ...child.props,
                          id: resolvedId,
                          active: value,
                          onClick: handleOnChange,
                      })
                    : null;
            })}
        </div>
    );
}

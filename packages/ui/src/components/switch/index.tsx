import React, { type ReactElement, forwardRef } from "react";
import RcSwitch, {
    type SwitchChangeEventHandler,
    type SwitchClickEventHandler,
} from "rc-switch";
import "rc-switch/assets/index.css";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface SwitchProps
    extends Omit<
        React.HTMLAttributes<HTMLButtonElement>,
        "onChange" | "onClick" | "dangerouslySetInnerHTML"
    > {
    className?: string;
    size?: "lg" | "sm" | "xs";
    disabled?: boolean;
    checkedChildren?: React.ReactNode;
    unCheckedChildren?: React.ReactNode;
    onChange?: SwitchChangeEventHandler;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
    onClick?: SwitchClickEventHandler;
    tabIndex?: number;
    checked?: boolean;
    defaultChecked?: boolean;
    style?: React.CSSProperties;
    title?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    function Switch({ size = "sm", className, ...props }, ref): ReactElement {
        return (
            <RcSwitch
                {...props}
                ref={ref}
                className={classNames(className, styles.root, {
                    [styles[size]]: true,
                })}
            />
        );
    },
);

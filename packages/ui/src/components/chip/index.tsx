import { type HTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface BaseChipsProps {
    size?: "xs" | "sm";
    clickable?: boolean;
    active?: boolean;
    variant?: "primary" | "secondary";
    border?: "rounded" | "squared";
    className?: { root?: string };
    children: string | ReactNode;
}

export type ChipProps = BaseChipsProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BaseChipsProps>;

export const Chip = ({
    size = "sm",
    clickable,
    active,
    variant = "primary",
    border = "rounded",
    children,
    className,
    ...rest
}: ChipProps) => (
    <div
        {...rest}
        className={classNames(className?.root, styles.root, {
            [styles[size]]: true,
            [styles[variant]]: true,
            [styles[border]]: true,
            [styles.rootClickable]: clickable,
            [styles.rootActive]: active,
        })}
    >
        {typeof children === "string" ? (
            <Typography size={size} weight="medium">
                {children}
            </Typography>
        ) : (
            children
        )}
    </div>
);

import classNames from "classnames";
import type { ReactNode } from "react";
import { Typography, type TypographyProps } from "../typography";
import { Skeleton } from "../skeleton";

import styles from "./styles.module.css";

interface TextFieldProps
    extends Omit<TypographyProps, "children" | "className"> {
    alignment?: "left" | "center" | "right";
    boxed?: boolean;
    label: string;
    value?: ReactNode;
    loading?: boolean;
    skeletonWidth?: number;
    className?: string;
}

export function TextField({
    alignment = "left",
    boxed = false,
    label,
    value,
    loading,
    skeletonWidth = 125,
    size = "lg",
    className,
    ...rest
}: TextFieldProps) {
    return (
        <div
            className={classNames("root", className, styles.root, {
                [styles.boxed]: boxed,
                [styles.alignCenter]: alignment === "center",
                [styles.alignRight]: alignment === "right",
            })}
        >
            <Typography uppercase weight="medium" variant="tertiary"size="sm">
                {label}
            </Typography>
            {loading ? (
                <Skeleton size={size} width={skeletonWidth} />
            ) : typeof value === "string" || typeof value === "number" ? (
                <Typography weight="medium" size={size} {...rest}>
                    {value}
                </Typography>
            ) : (
                value
            )}
        </div>
    );
}

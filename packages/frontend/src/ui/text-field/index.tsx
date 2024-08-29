import classNames from "@/src/utils/classes";
import type { ReactNode } from "react";
import { Typography, type TypographyProps } from "../typography";
import { Skeleton } from "../skeleton";

import styles from "./styles.module.css";

interface TextFieldProps extends Omit<TypographyProps, "children"> {
    alignment?: "left" | "center" | "right";
    boxed?: boolean;
    label: string;
    value?: ReactNode;
    loading?: boolean;
    className?: string;
}

export function TextField({
    alignment = "left",
    boxed = false,
    label,
    value,
    loading,
    className,
    variant = "lg",
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
            <Typography uppercase weight="medium" light variant="sm">
                {label}
            </Typography>
            {loading ? (
                <Skeleton variant={variant} width={125} />
            ) : typeof value === "string" ? (
                <Typography weight="medium" variant={variant} {...rest}>
                    {value}
                </Typography>
            ) : (
                value
            )}
        </div>
    );
}

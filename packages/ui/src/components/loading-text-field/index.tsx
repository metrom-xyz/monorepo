import classNames from "classnames";
import { type TypographyProps } from "../typography";
import { Skeleton } from "../skeleton";

import styles from "./styles.module.css";

interface LoadingTextFieldProps
    extends Omit<TypographyProps, "children" | "className"> {
    alignment?: "left" | "center" | "right";
    boxed?: boolean;
    label: string;
    className?: string;
}

export function LoadingTextField({
    alignment = "left",
    boxed = false,
    label,
    className,
    variant = "lg",
}: LoadingTextFieldProps) {
    return (
        <div
            className={classNames("root", className, styles.root, {
                [styles.boxed]: boxed,
                [styles.alignCenter]: alignment === "center",
                [styles.alignRight]: alignment === "right",
            })}
        >
            <p className={styles.label}>{label}</p>
            <Skeleton variant={variant} width={125} />
        </div>
    );
}

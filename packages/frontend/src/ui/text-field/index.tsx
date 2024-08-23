import classNames from "@/src/utils/classes";
import type { ReactNode } from "react";
import { Typography } from "../typography";

import styles from "./styles.module.css";

interface TextFieldProps {
    alignment?: "left" | "center" | "right";
    boxed?: boolean;
    label: string;
    value: ReactNode;
    className?: string;
}

export function TextField({
    alignment = "left",
    boxed = false,
    label,
    value,
    className,
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
            <Typography uppercase weight="medium" variant="lg">
                {value}
            </Typography>
        </div>
    );
}

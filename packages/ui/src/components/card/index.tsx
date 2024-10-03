import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface CardProps {
    children?: ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={classNames("root", styles.root, className)}>
            {children}
        </div>
    );
}

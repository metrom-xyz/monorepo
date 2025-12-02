import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface BoldTextProps {
    children: ReactNode;
}

export function BoldText({ children }: BoldTextProps) {
    return <span className={styles.root}>{children}</span>;
}

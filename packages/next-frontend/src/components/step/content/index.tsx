import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface StepContentProps {
    children?: ReactNode;
}

export function StepContent({ children }: StepContentProps) {
    return <div className={styles.root}>{children}</div>;
}

import type { ReactNode } from "react";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface StepSectionProps {
    title: ReactNode;
    description?: string;
    children: ReactNode;
}

export function StepSection({
    title,
    description,
    children,
}: StepSectionProps) {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                {title}
                {description && (
                    <Typography size="xs" variant="tertiary">
                        {description}
                    </Typography>
                )}
            </div>
            {children}
        </div>
    );
}

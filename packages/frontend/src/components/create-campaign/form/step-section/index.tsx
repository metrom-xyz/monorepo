import type { ReactNode } from "react";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface StepSectionProps {
    title: string;
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
                <Typography weight="semibold">{title}</Typography>
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

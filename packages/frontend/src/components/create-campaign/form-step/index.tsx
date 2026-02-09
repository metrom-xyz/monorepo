import { Accordion, Typography } from "@metrom-xyz/ui";
import { GreenCheckIcon } from "@/src/assets/green-check-icon";
import { ErrorIcon } from "@/src/assets/error-icon";
import { type ReactNode } from "react";

import styles from "./styles.module.css";

interface FormStepProps {
    title: string;
    open: boolean;
    completed: boolean;
    error?: string;
    onToggle: (open: boolean) => void;
    children: ReactNode;
}

export function FormStep({
    title,
    open,
    completed,
    error,
    onToggle,
    children,
}: FormStepProps) {
    return (
        <Accordion
            title={
                <div className={styles.header}>
                    {completed ? (
                        <GreenCheckIcon />
                    ) : error ? (
                        <ErrorIcon />
                    ) : (
                        <div className={styles.greenDot} />
                    )}
                    <Typography weight="semibold" className={styles.title}>
                        {title}
                    </Typography>
                </div>
            }
            open={open}
            onToggle={onToggle}
            className={styles.root}
        >
            <div className={styles.content}>{children}</div>
        </Accordion>
    );
}

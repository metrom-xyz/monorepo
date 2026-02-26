import { Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { type ReactNode } from "react";
import { ErrorIcon } from "@/src/assets/error-icon";

import styles from "./styles.module.css";

interface FormStepPreviewProps {
    title: string;
    completed?: boolean;
    error?: boolean;
    children?: ReactNode;
}

export function FormStepPreview({
    title,
    completed,
    error,
    children,
}: FormStepPreviewProps) {
    return (
        <div className={styles.root}>
            <div className={styles.leftContent}>
                <div className={styles.iconWrapper}>
                    {error ? (
                        <ErrorIcon className={styles.errorIcon} />
                    ) : completed ? (
                        <CheckIcon className={styles.checkIcon} />
                    ) : (
                        <div className={styles.greenDot} />
                    )}
                </div>
                <div className={styles.dash}></div>
            </div>
            <div className={styles.rightContent}>
                <Typography size="xs" weight="semibold" uppercase>
                    {title}
                </Typography>
                {children}
            </div>
        </div>
    );
}

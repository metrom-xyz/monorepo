import { Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { type ReactNode } from "react";
import { ErrorIcon } from "@/src/assets/error-icon";

import styles from "./styles.module.css";

interface FormStepPreviewProps {
    title: ReactNode;
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
            <div className={styles.top}>
                <div className={styles.iconWrapper}>
                    {error ? (
                        <ErrorIcon className={styles.errorIcon} />
                    ) : completed ? (
                        <CheckIcon className={styles.checkIcon} />
                    ) : (
                        <div className={styles.greenDot} />
                    )}
                </div>
                {typeof title === "string" ? (
                    <Typography size="xs" weight="semibold" uppercase>
                        {title}
                    </Typography>
                ) : (
                    title
                )}
            </div>
            <div className={styles.bottom}>
                <div className={styles.dash}></div>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}

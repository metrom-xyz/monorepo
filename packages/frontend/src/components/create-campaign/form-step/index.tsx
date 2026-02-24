import { Accordion, Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { ErrorIcon } from "@/src/assets/error-icon";
import { type ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface FormStepProps {
    title: string;
    open: boolean;
    completed?: boolean;
    error?: string;
    warning?: string;
    children: ReactNode;
    className?: string;
    onToggle: (open: boolean) => void;
}

export function FormStep({
    title,
    open,
    completed,
    error,
    warning,
    children,
    className,
    onToggle,
}: FormStepProps) {
    return (
        <Accordion
            title={
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        {error ? (
                            <ErrorIcon className={styles.errorIcon} />
                        ) : warning ? (
                            <ErrorIcon className={styles.warningIcon} />
                        ) : completed ? (
                            <CheckIcon className={styles.checkIcon} />
                        ) : (
                            <div className={styles.greenDot} />
                        )}
                    </div>
                    <Typography weight="semibold" className={styles.title}>
                        {title}
                    </Typography>
                    {error && (
                        <Typography
                            weight="medium"
                            className={styles.errorText}
                        >
                            {error}
                        </Typography>
                    )}
                    {warning && (
                        <Typography
                            weight="medium"
                            className={styles.warningText}
                        >
                            {warning}
                        </Typography>
                    )}
                </div>
            }
            open={open}
            noUnmount
            onToggle={onToggle}
            className={classNames(
                "root",
                styles.root,
                { [styles.error]: error, [styles.warning]: warning },
                className,
            )}
        >
            <div className={classNames("content", styles.content)}>
                {children}
            </div>
        </Accordion>
    );
}

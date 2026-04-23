import { Accordion, Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { ErrorIcon } from "@/src/assets/error-icon";
import { useCallback, type ReactNode } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface FormStepProps {
    title: string;
    open: boolean;
    titleDecorator?: ReactNode;
    optional?: boolean;
    disabled?: boolean;
    completed?: boolean;
    skipped?: boolean;
    error?: string;
    warning?: string;
    children: ReactNode;
    className?: string;
    onToggle: (open: boolean) => void;
}

export function FormStep({
    title,
    open,
    titleDecorator,
    optional,
    disabled,
    completed,
    skipped,
    error,
    warning,
    children,
    className,
    onToggle,
}: FormStepProps) {
    const t = useTranslations("newCampaign");

    const getIcon = useCallback(() => {
        if (error && !open) return <ErrorIcon className={styles.errorIcon} />;
        if (warning && !open)
            return <ErrorIcon className={styles.warningIcon} />;
        if (completed) return <CheckIcon className={styles.checkIcon} />;
        if (!completed && open) return <div className={styles.greenDot} />;
        if (skipped && optional)
            return (
                <Typography size="sm" weight="medium">
                    -
                </Typography>
            );
    }, [completed, error, open, warning, skipped, optional]);

    const derivedCompleted =
        (completed || (skipped && optional)) && !open && !error && !warning;

    return (
        <Accordion
            title={
                <div className={styles.header}>
                    {getIcon()}
                    <Typography
                        size={derivedCompleted ? "xs" : "base"}
                        weight="semibold"
                    >
                        {title}
                    </Typography>
                    {titleDecorator}
                    {optional && (
                        <div className={styles.optionalTag}>
                            <Typography
                                size="xs"
                                weight="medium"
                                variant="tertiary"
                            >
                                {t("optional")}
                            </Typography>
                        </div>
                    )}
                    {!open && error && (
                        <Typography
                            weight="medium"
                            className={styles.errorText}
                        >
                            {error}
                        </Typography>
                    )}
                    {!open && warning && (
                        <Typography
                            weight="medium"
                            className={styles.warningText}
                        >
                            {warning}
                        </Typography>
                    )}
                </div>
            }
            iconPlacement="right"
            open={open}
            disabled={disabled}
            noUnmount
            onToggle={onToggle}
            className={classNames(
                "root",
                styles.root,
                {
                    [styles.error]: error && !open,
                    [styles.completed]: derivedCompleted,
                    [styles.warning]: warning,
                    [styles.disabled]: disabled,
                },
                className,
            )}
        >
            <div
                className={classNames("content", styles.content, {
                    [styles.disabled]: disabled,
                })}
            >
                {children}
            </div>
        </Accordion>
    );
}

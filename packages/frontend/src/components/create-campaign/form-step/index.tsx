import { Accordion, Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { ErrorIcon } from "@/src/assets/error-icon";
import { type ReactNode } from "react";
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
    error,
    warning,
    children,
    className,
    onToggle,
}: FormStepProps) {
    const t = useTranslations("newCampaign");

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
                        ) : optional ? (
                            <Typography size="sm" weight="medium">
                                -
                            </Typography>
                        ) : (
                            <div className={styles.greenDot} />
                        )}
                    </div>
                    <Typography weight="semibold">{title}</Typography>
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
            iconPlacement="right"
            open={open}
            disabled={disabled}
            noUnmount
            onToggle={onToggle}
            className={classNames(
                "root",
                styles.root,
                {
                    [styles.error]: error,
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

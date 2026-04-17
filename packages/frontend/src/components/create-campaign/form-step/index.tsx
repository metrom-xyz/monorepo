import { Accordion, Typography } from "@metrom-xyz/ui";
import { CheckIcon } from "@/src/assets/check-icon";
import { ErrorIcon } from "@/src/assets/error-icon";
import { type ReactNode } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";

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

const ICON_MOTION: HTMLMotionProps<"div"> = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
        duration: 0.15,
        ease: "easeOut",
    },
};

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
                        <AnimatePresence mode="wait" initial={false}>
                            {error ? (
                                <motion.div key="error" {...ICON_MOTION}>
                                    <ErrorIcon className={styles.errorIcon} />
                                </motion.div>
                            ) : warning ? (
                                <motion.div key="warning" {...ICON_MOTION}>
                                    <ErrorIcon className={styles.warningIcon} />
                                </motion.div>
                            ) : completed ? (
                                <motion.div key="check" {...ICON_MOTION}>
                                    <CheckIcon className={styles.checkIcon} />
                                </motion.div>
                            ) : optional ? (
                                <motion.div key="optional" {...ICON_MOTION}>
                                    <Typography size="sm" weight="medium">
                                        -
                                    </Typography>
                                </motion.div>
                            ) : (
                                <motion.div key="dot" {...ICON_MOTION}>
                                    <div className={styles.greenDot} />
                                </motion.div>
                            )}
                        </AnimatePresence>
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

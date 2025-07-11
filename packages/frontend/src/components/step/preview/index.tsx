"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "@/src/assets/chevron-down";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    label: ReactNode;
    open?: boolean;
    completed?: boolean;
    disabled?: boolean;
    decorator?: boolean;
    children?: ReactNode;
    className?: {
        root?: string;
    };
}

export function StepPreview({
    label,
    open,
    completed,
    disabled,
    decorator = true,
    children,
    className,
}: StepPreviewProps) {
    return (
        <div
            className={classNames(className?.root, styles.root, {
                [styles.completed]: completed,
                [styles.disabled]: disabled,
                [styles.open]: open,
            })}
        >
            <div className={styles.wrapper}>
                {typeof label === "string" ? (
                    <Typography
                        uppercase
                        weight="medium"
                        className={classNames(styles.label, {
                            [styles.completed]: completed,
                        })}
                    >
                        {label}
                    </Typography>
                ) : (
                    <div
                        className={classNames(styles.label, {
                            [styles.completed]: completed,
                        })}
                    >
                        {label}
                    </div>
                )}
                {completed && (
                    <motion.div
                        initial="hide"
                        animate="show"
                        exit="hide"
                        variants={{
                            hide: { opacity: 0 },
                            show: { opacity: 1 },
                        }}
                        className={classNames(styles.children, {
                            [styles.childrenShow]: completed,
                        })}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
            {decorator && (
                <div className={styles.iconWrapper}>
                    <ChevronDown
                        className={classNames(styles.icon, {
                            [styles.iconOpen]: open,
                        })}
                    />
                </div>
            )}
        </div>
    );
}

"use client";

import React, { type ReactElement, useRef } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { StepPreview, type StepPreviewProps } from "./preview";
import { StepContent } from "./content";
import { matchChildByType } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface StepProps {
    disabled?: boolean;
    completed?: boolean;
    open?: boolean;
    error?: boolean;
    errorLevel?: "warning" | "error";
    children: ReactElement[];
    className?: string;
    onPreviewClick?: () => void;
}

export function Step({
    disabled,
    completed,
    open,
    error,
    errorLevel = "error",
    children,
    className,
    onPreviewClick,
}: StepProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const childrenArray = React.Children.toArray(children);

    const previewChildren = childrenArray.find((child) =>
        matchChildByType(child, StepPreview),
    ) as ReactElement<StepPreviewProps>;
    const contentChildren = childrenArray.find((child) =>
        matchChildByType(child, StepContent),
    ) as ReactElement;

    return (
        <div className={styles.root}>
            <motion.div
                initial={{ height: 84 }}
                animate={{ height: open ? "auto" : 84 }}
                className={classNames(className, styles.root, {
                    [styles.disabled]: disabled,
                    [styles.error]: error && errorLevel === "error",
                    [styles.warning]: error && errorLevel === "warning",
                    [styles.open]: open,
                })}
            >
                <div ref={wrapperRef}>
                    <div ref={rootRef} onClick={onPreviewClick}>
                        {React.cloneElement<StepPreviewProps>(previewChildren, {
                            open,
                            completed,
                        })}
                    </div>
                    {contentChildren}
                </div>
            </motion.div>
        </div>
    );
}

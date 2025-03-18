"use client";

import React, { type ReactElement, useRef } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { StepPreview, type StepPreviewProps } from "./preview";
import { StepContent } from "./content";
import { matchChildByType } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface StepProps {
    disabled?: boolean;
    completed?: boolean;
    open?: boolean;
    children: ReactElement[];
    className?: string;
    onPreviewClick?: () => void;
}

export function Step({
    disabled,
    completed,
    open,
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
        <motion.div
            initial={{ height: 84 }}
            animate={{ height: open ? "fit-content" : 84 }}
            className={classNames(className, styles.root, {
                [styles.disabled]: disabled,
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
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            inert={!open}
                        >
                            {contentChildren}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

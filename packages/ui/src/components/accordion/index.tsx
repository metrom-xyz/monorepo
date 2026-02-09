import { motion, easeInOut, AnimatePresence } from "motion/react";
import { type ReactNode, useCallback, useState } from "react";
import { ChevronDown } from "../../assets/chevron-down";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    open?: boolean;
    onToggle?: (open: boolean) => void;
    className?: string;
}

export function Accordion({
    title,
    children,
    open: controlledOpen,
    onToggle,
    className,
}: AccordionProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const controlled = controlledOpen !== undefined;
    const open = controlled ? controlledOpen : internalOpen;

    const handleOnToggleOpen = useCallback(() => {
        if (onToggle) onToggle(!open);
        if (!controlled) {
            setInternalOpen(!open);
        }
    }, [open, controlled, onToggle]);

    return (
        <div className={classNames("root", styles.root, className)}>
            <div
                onClick={handleOnToggleOpen}
                className={classNames("preview", styles.preview, {
                    [styles.open]: open,
                })}
            >
                {typeof title === "string" ? (
                    <Typography uppercase weight="medium" variant="tertiary">
                        {title}
                    </Typography>
                ) : (
                    title
                )}
                <ChevronDown
                    className={classNames("icon", styles.icon, {
                        [styles.open]: open,
                    })}
                />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ ease: easeInOut, duration: 0.2 }}
                        className={classNames("content", styles.content)}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

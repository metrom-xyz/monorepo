"use client";

import { motion, easeInOut, AnimatePresence } from "framer-motion";
import { type ReactNode, useState } from "react";
import { ChevronDown } from "../../assets/chevron-down";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface AccordionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function Accordion({ title, children, className }: AccordionProps) {
    const [open, setOpen] = useState(false);

    function handleOnToggleOpen() {
        setOpen((prevState) => !prevState);
    }

    return (
        <div className={classNames("root", styles.root, className)}>
            <div
                onClick={handleOnToggleOpen}
                className={classNames("preview", styles.preview, {
                    [styles.open]: open,
                })}
            >
                <ChevronDown
                    className={classNames("icon", styles.icon, {
                        [styles.open]: open,
                    })}
                />
                <Typography uppercase weight="medium" light>
                    {title}
                </Typography>
            </div>
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: open ? "auto" : 0 }}
                    transition={{ ease: easeInOut }}
                    className={styles.content}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

import { motion, easeInOut, AnimatePresence } from "motion/react";
import { type ReactNode, useState } from "react";
import { ChevronDown } from "../../assets/chevron-down";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    iconPlacement?: "left" | "right";
    noUnmount?: boolean;
    className?: string;
}

export function Accordion({
    title,
    children,
    iconPlacement = "left",
    noUnmount,
    className,
}: AccordionProps) {
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
                {iconPlacement === "left" && (
                    <ChevronDown
                        className={classNames("icon", styles.icon, {
                            [styles.open]: open,
                        })}
                    />
                )}
                {typeof title === "string" ? (
                    <Typography uppercase weight="medium" variant="tertiary">
                        {title}
                    </Typography>
                ) : (
                    title
                )}
                {iconPlacement === "right" && (
                    <ChevronDown
                        className={classNames("icon", styles.icon, {
                            [styles.open]: open,
                        })}
                    />
                )}
            </div>
            <AnimatePresence>
                {(noUnmount || open) && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{
                            height: noUnmount ? (open ? "auto" : 0) : "auto",
                        }}
                        exit={noUnmount ? undefined : { height: 0 }}
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

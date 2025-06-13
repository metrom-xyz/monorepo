import { type ReactNode, useEffect, useRef } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import { RemoveScroll } from "react-remove-scroll";

import styles from "./styles.module.css";

interface ModalProps {
    open?: boolean;
    onDismiss?: () => void;
    children?: ReactNode;
}

export function Modal({ open, onDismiss, children, ...rest }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || !onDismiss) return;
        const handleCloseOnClick = (event: MouseEvent) => {
            if (
                event.button === 0 && // don't close the modal on double clicks
                !!overlayRef.current &&
                overlayRef.current.isSameNode(event.target as Node)
            )
                onDismiss();
        };
        const handleCloseOnKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onDismiss();
        };
        document.addEventListener("mousedown", handleCloseOnClick);
        document.addEventListener("keydown", handleCloseOnKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleCloseOnClick);
            document.removeEventListener("keydown", handleCloseOnKeyDown);
        };
    }, [onDismiss, open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: easeInOut, duration: 0.2 }}
                    className={`root ${styles.root}`}
                    ref={overlayRef}
                    {...rest}
                >
                    <RemoveScroll enabled={open}>{children}</RemoveScroll>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

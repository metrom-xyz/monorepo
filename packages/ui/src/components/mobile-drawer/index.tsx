import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface MobileDrawerProps {
    open?: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export function MobileDrawer({
    open,
    onClose,
    children,
    className,
}: MobileDrawerProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={classNames("overlay", styles.overlay)}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}
                        className={classNames("root", styles.root, className)}
                    >
                        <div className={classNames("drawer", styles.drawer)}>
                            <div className={styles.drawBar}></div>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

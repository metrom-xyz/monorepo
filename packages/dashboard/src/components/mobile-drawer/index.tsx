import { AnimatePresence, motion } from "motion/react";
import { type ReactNode } from "react";

import styles from "./styles.module.css";

interface MobileDrawerProps {
    open?: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function MobileDrawer({ open, onClose, children }: MobileDrawerProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, info) => {
                        if (info.offset.y > 100) onClose();
                    }}
                    className={styles.root}
                >
                    <div className={styles.drawer}>
                        <div className={styles.drawBar}></div>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

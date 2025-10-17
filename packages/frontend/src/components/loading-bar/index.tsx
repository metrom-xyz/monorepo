import { useEffect, useState } from "react";
import classNames from "classnames";
import { usePrevious } from "react-use";
import { AnimatePresence, motion } from "motion/react";

import styles from "./styles.module.css";

const MIN_LOADING_TIMEOUT = 50;
const INITIAL_SPEED = 5;
const SLOWDOWN_FACTOR = 20;

interface LoadingBarProps {
    loading: boolean;
    className?: string;
}

export function LoadingBar({ loading, className }: LoadingBarProps) {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const prevLoading = usePrevious(loading);

    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                setShow(true);
            }, MIN_LOADING_TIMEOUT);

            const interval = setInterval(() => {
                setProgress((prev) => {
                    const increment = Math.max(
                        0.5,
                        INITIAL_SPEED / (1 + prev / SLOWDOWN_FACTOR),
                    );
                    return Math.min(95, prev + increment);
                });
            }, 40);

            return () => {
                clearTimeout(timeout);
                clearInterval(interval);
            };
        } else if (prevLoading) {
            if (show) {
                setProgress(100);
                setTimeout(() => {
                    setProgress(0);
                    setShow(false);
                }, 150);
            } else {
                setProgress(0);
                setShow(false);
            }
        }
    }, [loading, prevLoading, show]);

    return (
        <div className={classNames(styles.root, className)}>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className={styles.progress}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        exit={{ width: "100%" }}
                        transition={{
                            duration: 0.1,
                            ease: "easeOut",
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

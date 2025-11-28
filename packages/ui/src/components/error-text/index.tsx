import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { ErrorIcon } from "../..//assets/error";
import { Typography, type TypographyProps } from "../typography";

import styles from "./styles.module.css";

type ErrorTextProps = TypographyProps & {
    level?: "error" | "warning";
    mountAnimation?: boolean;
};

export function ErrorText({
    level = "error",
    size = "base",
    mountAnimation = true,
    children,
    className,
    ...rest
}: ErrorTextProps) {
    return (
        <AnimatePresence>
            {!!children && (
                <motion.div
                    initial={mountAnimation ? "hide" : false}
                    animate="show"
                    exit="hide"
                    variants={{
                        hide: { opacity: 0 },
                        show: { opacity: 1 },
                    }}
                    className={classNames("root", styles.root, className)}
                >
                    <ErrorIcon
                        className={classNames("icon", styles.icon, {
                            [styles[size]]: true,
                            [styles[level]]: true,
                        })}
                    />
                    <Typography
                        uppercase
                        {...rest}
                        size={size}
                        className={classNames("text", styles.text, {
                            [styles[level]]: true,
                        })}
                    >
                        {children}
                    </Typography>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

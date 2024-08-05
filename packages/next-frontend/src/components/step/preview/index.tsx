import { useEffect, type ReactNode, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { ChevronIcon } from "@/src/assets/chevron-icon";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    label: ReactNode;
    open?: boolean;
    completed?: boolean;
    children?: ReactNode;
}

export function StepPreview({
    label,
    open,
    completed,
    children,
}: StepPreviewProps) {
    const [showChildren, setShowChildren] = useState(false);

    const [labelStyle, animateLabel] = useSpring(() => ({
        y: 0,
        opacity: 1,
    }));
    const [childrenStyle, animateChildren] = useSpring(() => ({
        opacity: 0,
    }));

    useEffect(() => {
        if (!completed) return;

        animateLabel.start({
            from: { y: 0 },
            to: { y: -18, opacity: 0.4 },
            config: { duration: 100 },
            onRest: () => {
                setShowChildren(true);
                animateChildren.start({
                    to: { opacity: 1 },
                    config: { duration: 100 },
                });
            },
        });
    }, [completed, animateLabel, animateChildren]);

    return (
        <div
            className={classNames(styles.root, {
                [styles.rootCompleted]: completed,
                [styles.rootOpen]: open,
            })}
        >
            <div className={styles.wrapper}>
                <animated.div style={labelStyle}>
                    {typeof label === "string" ? (
                        <Typography uppercase weight="medium">
                            {label}
                        </Typography>
                    ) : (
                        label
                    )}
                </animated.div>
                <animated.div
                    style={childrenStyle}
                    className={classNames(styles.children, {
                        [styles.childrenShow]: showChildren,
                    })}
                >
                    {children}
                </animated.div>
            </div>
            <div className={styles.iconWrapper}>
                <ChevronIcon
                    className={classNames(styles.icon, {
                        [styles.iconOpen]: open,
                    })}
                />
            </div>
        </div>
    );
}

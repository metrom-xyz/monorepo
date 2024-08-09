import { type ReactNode } from "react";
import {
    animated,
    useChain,
    useSpring,
    useSpringRef,
    useTransition,
} from "@react-spring/web";
import { ChevronDownIcon } from "@/src/assets/chevron-down-icon";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    label: ReactNode;
    open?: boolean;
    completed?: boolean;
    children?: ReactNode;
}

const AnimatedTypography = animated(Typography);

export function StepPreview({
    label,
    open,
    completed,
    children,
}: StepPreviewProps) {
    const labelSpring = useSpringRef();
    const labelSpringStyle = useSpring({
        ref: labelSpring,
        y: 0,
        opacity: 1,
        fontSize: "1rem",
        to: {
            y: completed ? -18 : 0,
            opacity: completed ? 0.4 : 1,
            fontSize: completed ? "0.75rem" : "1rem",
        },
        config: { duration: 100 },
    });

    const childrenTransitionSpring = useSpringRef();
    const childrenTransition = useTransition(completed, {
        ref: childrenTransitionSpring,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 100 },
    });

    useChain(
        completed
            ? [labelSpring, childrenTransitionSpring]
            : [childrenTransitionSpring, labelSpring],
        completed ? [0, 0.1] : [0, 0.1],
    );

    return (
        <div
            className={classNames(styles.root, {
                [styles.rootCompleted]: completed,
                [styles.rootOpen]: open,
            })}
        >
            <div className={styles.wrapper}>
                {typeof label === "string" ? (
                    <AnimatedTypography
                        style={labelSpringStyle}
                        uppercase
                        weight="medium"
                    >
                        {label}
                    </AnimatedTypography>
                ) : (
                    <animated.div style={labelSpringStyle}>
                        {label}
                    </animated.div>
                )}
                {childrenTransition(
                    (style, item) =>
                        item && (
                            <animated.div
                                style={style}
                                className={classNames(styles.children, {
                                    [styles.childrenShow]: item,
                                })}
                            >
                                {children}
                            </animated.div>
                        ),
                )}
            </div>
            <div className={styles.iconWrapper}>
                <ChevronDownIcon
                    className={classNames(styles.icon, {
                        [styles.iconOpen]: open,
                    })}
                />
            </div>
        </div>
    );
}

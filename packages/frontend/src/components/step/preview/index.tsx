import { type ReactNode } from "react";
import {
    animated,
    useChain,
    useSpring,
    useSpringRef,
    useTransition,
} from "@react-spring/web";
import { ChevronDown } from "@/src/assets/chevron-down";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    label: ReactNode;
    open?: boolean;
    completed?: boolean;
    decorator?: boolean;
    children?: ReactNode;
    className?: {
        root?: string;
    };
}

const AnimatedTypography = animated(Typography);

export function StepPreview({
    label,
    open,
    completed,
    decorator = true,
    children,
    className,
}: StepPreviewProps) {
    const labelSpring = useSpringRef();
    const labelSpringStyle = useSpring({
        ref: labelSpring,
        y: 0,
        color: "black",
        fontSize: "1rem",
        to: {
            y: completed ? -6 : 0,
            color: completed ? "#9CA3AF" : "black",
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
            className={classNames(className?.root, styles.root, {
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
                        className={styles.label}
                    >
                        {label}
                    </AnimatedTypography>
                ) : (
                    <animated.div
                        style={labelSpringStyle}
                        className={styles.label}
                    >
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
            {decorator && (
                <div className={styles.iconWrapper}>
                    <ChevronDown
                        className={classNames(styles.icon, {
                            [styles.iconOpen]: open,
                        })}
                    />
                </div>
            )}
        </div>
    );
}

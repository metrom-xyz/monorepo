import { useEffect, type ReactNode } from "react";
import { animated, useSpring } from "@react-spring/web";
import { ChevronIcon } from "@/src/assets/chevron-icon";
import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    label: string;
    open?: boolean;
    completed?: boolean;
    heightAnimationDone?: boolean;
    children?: ReactNode;
}

export function StepPreview({
    label,
    open,
    completed,
    heightAnimationDone,
    children,
}: StepPreviewProps) {
    const [spring, api] = useSpring(() => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 200 },
    }));

    useEffect(() => {
        api.start({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 200 },
        });
    }, [api, completed]);

    return (
        <div
            className={classNames(styles.root, {
                [styles.rootOpen]: open || !heightAnimationDone,
                [styles.rootCompleted]: completed,
            })}
        >
            {completed ? (
                <div>
                    <Typography
                        uppercase
                        variant="sm"
                        weight="medium"
                        className={{
                            root: "transition-opacity duration-200 ease-out opacity-40",
                        }}
                    >
                        {label}
                    </Typography>
                    <animated.div style={spring} className={styles.dexPreview}>
                        {children}
                    </animated.div>
                </div>
            ) : (
                <Typography uppercase variant="lg" weight="medium">
                    {label}
                </Typography>
            )}
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

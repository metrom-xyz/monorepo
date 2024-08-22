import React, { type ReactElement, useRef, useEffect } from "react";
import classNames from "@/src/utils/classes";
import { animated, easings, useSpring, useTransition } from "@react-spring/web";
import { matchChildByType } from "@/src/utils/components";
import { StepPreview, type StepPreviewProps } from "./preview";
import { StepContent } from "./content";

import styles from "./styles.module.css";

interface StepProps {
    disabled?: boolean;
    completed?: boolean;
    open?: boolean;
    error?: boolean;
    onPreviewClick?: () => void;
    children: ReactElement[];
}

export function Step({
    disabled,
    completed,
    open,
    error,
    onPreviewClick,
    children,
}: StepProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [springStyles, springApi] = useSpring(
        () => ({
            height: "84px",
        }),
        [],
    );
    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    const childrenArray = React.Children.toArray(children);

    const previewChildren = childrenArray.find((child) =>
        matchChildByType(child, StepPreview),
    ) as ReactElement;
    const contentChildren = childrenArray.find((child) =>
        matchChildByType(child, StepContent),
    ) as ReactElement;

    useEffect(() => {
        springApi.start({
            height:
                (open
                    ? wrapperRef?.current?.offsetHeight
                    : rootRef.current?.offsetHeight) + "px",
            config: { duration: 200, easing: easings.easeInOutCubic },
        });
    }, [springApi, open, previewChildren]);

    return (
        <animated.div
            style={springStyles}
            className={classNames(styles.root, {
                [styles.disabled]: disabled,
                [styles.error]: error,
                [styles.open]: open,
            })}
        >
            <div ref={wrapperRef}>
                <div ref={rootRef} onClick={onPreviewClick}>
                    {React.cloneElement<StepPreviewProps>(previewChildren, {
                        open,
                        completed,
                    })}
                </div>
                {transition(
                    (styles, open) =>
                        open && (
                            <animated.div style={styles}>
                                {contentChildren}
                            </animated.div>
                        ),
                )}
            </div>
        </animated.div>
    );
}

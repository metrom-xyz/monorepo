import React, { type ReactElement, useState, useRef, useEffect } from "react";
import classNames from "@/src/utils/classes";
import { animated, easings, useSpring, useTransition } from "@react-spring/web";
import { matchChildByType } from "@/src/utils/components";
import { StepPreview, type StepPreviewProps } from "./preview";
import { StepContent } from "./content";

import styles from "./styles.module.css";

interface StepProps {
    closeBehavior?: "manual" | "innerClick";
    disabled?: boolean;
    children: ReactElement[];
}

export function Step({
    closeBehavior: close = "manual",
    disabled,
    children,
}: StepProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const [spring, animate] = useSpring(
        () => ({
            height: "83px",
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
        animate({
            height: (open ? wrapperRef?.current?.offsetHeight : 83) + "px",
            config: { duration: 200, easing: easings.easeInOutCubic },
        });
    }, [animate, open]);

    function handlePreviewOnClick() {
        setOpen((open) => !open);
    }

    function handleContentOnClick() {
        if (close === "manual") return;
        setOpen((open) => !open);
    }

    return (
        <animated.div
            style={spring}
            className={classNames(styles.root, {
                [styles.rootDisabled]: disabled,
            })}
        >
            <div ref={wrapperRef}>
                <div onClick={handlePreviewOnClick}>
                    {React.cloneElement<StepPreviewProps>(previewChildren, {
                        open,
                    })}
                </div>
                {transition(
                    (styles, open) =>
                        open && (
                            <animated.div
                                style={styles}
                                onClick={handleContentOnClick}
                            >
                                {contentChildren}
                            </animated.div>
                        ),
                )}
            </div>
        </animated.div>
    );
}

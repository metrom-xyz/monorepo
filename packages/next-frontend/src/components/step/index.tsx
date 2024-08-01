import React, { type ReactElement, useState, useRef } from "react";
import classNames from "@/src/utils/classes";
import { animated, easings, useSpring } from "@react-spring/web";
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

    const childrenArray = React.Children.toArray(children);

    const previewChildren = childrenArray.find((child) =>
        matchChildByType(child, StepPreview),
    ) as ReactElement;
    const contentChildren = childrenArray.find((child) =>
        matchChildByType(child, StepContent),
    ) as ReactElement;

    function handlePreviewOnClick() {
        setOpen((open) => !open);
        animate({
            height: (open ? 83 : wrapperRef?.current?.offsetHeight) + "px",
            config: { duration: 200, easing: easings.easeInOutCubic },
        });
    }

    function handleContentOnClick() {
        if (close === "manual") return;
        setOpen((open) => !open);
        animate({
            height: (open ? 83 : wrapperRef?.current?.offsetHeight) + "px",
            config: { duration: 250, easing: easings.easeInOutCubic },
        });
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
                <div onClick={handleContentOnClick}>{contentChildren}</div>
            </div>
        </animated.div>
    );
}

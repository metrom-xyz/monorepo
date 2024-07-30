import React, { type ReactElement, useState } from "react";
import AnimateHeight, { type Height } from "react-animate-height";
import { matchChildByType } from "@/src/utils/components";
import classNames from "classnames";
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
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState<Height>(0);
    const [heightAnimationDone, setHeightAnimationDone] = useState(true);

    const childrenArray = React.Children.toArray(children);

    const previewChildren = childrenArray.find((child) =>
        matchChildByType(child, StepPreview),
    ) as ReactElement;
    const contentChildren = childrenArray.find((child) =>
        matchChildByType(child, StepContent),
    ) as ReactElement;

    function handlePreviewOnClick() {
        setOpen((open) => !open);
        setHeight(open ? 0 : "auto");
    }

    function handleContentOnClick() {
        if (close === "manual") return;
        setOpen((open) => !open);
        setHeight(open ? 0 : "auto");
    }

    // Track the height animation status for the StepPreview component.
    // This status is used to dynamically apply a CSS class to remove the bottom border rounding
    // only after the animation has completed.
    function handleContentAnimationOnEnd() {
        setHeightAnimationDone((state) => !state);
    }

    return (
        <div
            className={classNames(styles.step__root, {
                [styles.step__root_disabled]: disabled,
            })}
        >
            <div onClick={handlePreviewOnClick}>
                {React.cloneElement<StepPreviewProps>(previewChildren, {
                    open,
                    heightAnimationDone,
                })}
            </div>
            <AnimateHeight
                height={height}
                duration={200}
                easing="ease-in-out"
                onHeightAnimationEnd={handleContentAnimationOnEnd}
            >
                <div onClick={handleContentOnClick}>{contentChildren}</div>
            </AnimateHeight>
        </div>
    );
}

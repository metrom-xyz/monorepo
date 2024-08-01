import React, { type ReactElement, useState } from "react";
import AnimateHeight, { type Height } from "react-animate-height";
import classNames from "@/src/utils/classes";
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
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState<Height>(83);

    const childrenArray = React.Children.toArray(children);

    const previewChildren = childrenArray.find((child) =>
        matchChildByType(child, StepPreview),
    ) as ReactElement;
    const contentChildren = childrenArray.find((child) =>
        matchChildByType(child, StepContent),
    ) as ReactElement;

    function handlePreviewOnClick() {
        setOpen((open) => !open);
        setHeight(open ? 83 : "auto");
    }

    function handleContentOnClick() {
        if (close === "manual") return;
        setOpen((open) => !open);
        setHeight(open ? 83 : "auto");
    }

    return (
        <AnimateHeight
            height={height}
            duration={200}
            easing="ease-in-out"
            className={classNames(styles.root, {
                [styles.rootDisabled]: disabled,
            })}
        >
            <div onClick={handlePreviewOnClick}>
                {React.cloneElement<StepPreviewProps>(previewChildren, {
                    open,
                })}
            </div>
            <div onClick={handleContentOnClick}>{contentChildren}</div>
        </AnimateHeight>
    );
}

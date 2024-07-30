import { type ReactNode } from "react";
import { ChevronIcon } from "@/src/assets/chevron-icon";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface StepPreviewProps {
    open?: boolean;
    completed?: boolean;
    heightAnimationDone?: boolean;
    children?: ReactNode;
}

export function StepPreview({
    open,
    completed,
    heightAnimationDone,
    children,
}: StepPreviewProps) {
    return (
        <div
            className={classNames(styles.step_preview__root, {
                [styles.step_preview__root_open]: open || !heightAnimationDone,
                [styles.step_preview__root_completed]: completed,
            })}
        >
            {children}
            <div className={styles.step_preview__icon__wrapper}>
                <ChevronIcon
                    className={classNames(styles.step_preview__icon, {
                        [styles.step_preview__icon_open]: open,
                    })}
                />
            </div>
        </div>
    );
}

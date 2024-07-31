import { type ReactNode } from "react";
import { ChevronIcon } from "@/src/assets/chevron-icon";
import classNames from "@/src/utils/classes";

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
            className={classNames(styles.root, {
                [styles.root_open]: open || !heightAnimationDone,
                [styles.root_completed]: completed,
            })}
        >
            {children}
            <div className={styles.icon__wrapper}>
                <ChevronIcon
                    className={classNames(styles.icon, {
                        [styles.icon_open]: open,
                    })}
                />
            </div>
        </div>
    );
}

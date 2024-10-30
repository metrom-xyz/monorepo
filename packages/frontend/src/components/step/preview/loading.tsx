import type { ReactNode } from "react";
import { ChevronDown } from "@/src/assets/chevron-down";

import styles from "./styles.module.css";

interface LoadingPreviewProps {
    children: ReactNode;
}

export function LoadingPreview({ children }: LoadingPreviewProps) {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <p className={styles.previewLabel}>{children}</p>
            </div>
            <div className={styles.iconWrapper}>
                <ChevronDown className={styles.icon} />
            </div>
        </div>
    );
}

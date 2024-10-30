import classNames from "classnames";
import { LoadingPreview } from "./preview/loading";

import styles from "./styles.module.css";

interface LoadingStepProps {
    label: string;
}

export function LoadingStep({ label }: LoadingStepProps) {
    return (
        <div
            className={classNames(styles.root, styles.loading, styles.disabled)}
        >
            <LoadingPreview>{label}</LoadingPreview>
        </div>
    );
}

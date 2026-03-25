import type { ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignTagProps {
    children: ReactNode;
    className?: string;
}

export function CampaignTagsGroup({ children, className }: CampaignTagProps) {
    return <div className={classNames(styles.root, className)}>{children}</div>;
}

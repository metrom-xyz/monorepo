import { CalendarClockIcon } from "@/src/assets/calendar-clock-icon";
import { Typography } from "@metrom-xyz/ui";
import type { FunctionComponent, SVGProps } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    className?: string;
}

export function EmptyState({
    title,
    subtitle,
    icon: Icon,
    className,
}: EmptyStateProps) {
    return (
        <div className={classNames(styles.root, className)}>
            {Icon ? (
                <Icon className={styles.icon} />
            ) : (
                <CalendarClockIcon className={styles.icon} />
            )}
            <Typography uppercase weight="medium" size="sm" variant="tertiary">
                {title}
            </Typography>
            {subtitle && (
                <Typography size="xs" variant="tertiary">
                    {subtitle}
                </Typography>
            )}
        </div>
    );
}

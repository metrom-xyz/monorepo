import { CalendarClockIcon } from "@/src/assets/calendar-clock-icon";
import { Typography } from "@metrom-xyz/ui";
import type { FunctionComponent, SVGProps } from "react";

import styles from "./styles.module.css";

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export function EmptyState({ title, subtitle, icon: Icon }: EmptyStateProps) {
    return (
        <div className={styles.root}>
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

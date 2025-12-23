import { CalendarClockIcon } from "@/src/assets/calendar-clock-icon";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface EmptyStateProps {
    title: string;
    subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
    return (
        <div className={styles.root}>
            <CalendarClockIcon className={styles.icon} />
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

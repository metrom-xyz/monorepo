import { Skeleton } from "@metrom-xyz/ui";
import styles from "./styles.module.css";

interface CounterProps {
    label?: string;
    count?: number;
    loading?: boolean;
}

export function Counter({ label, count, loading }: CounterProps) {
    return (
        <div className={styles.root}>
            <span>{label}</span>
            <div className={styles.counter}>
                {loading ? <Skeleton className="min-w-8!" /> : count}
            </div>
        </div>
    );
}

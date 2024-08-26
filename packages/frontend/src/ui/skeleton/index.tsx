import classNames from "@/src/utils/classes";

import styles from "./styles.module.css";

type SkeletonVariant = "xs" | "sm" | "base" | "lg";

export interface SkeletonProps {
    variant?: SkeletonVariant;
    circular?: boolean;
    width?: number | string;
    height?: number | string;
    className?: string;
}

export function Skeleton({
    variant = "base",
    circular,
    width,
    height,
    className,
    ...rest
}: SkeletonProps) {
    return (
        <div
            style={{
                width,
                height: circular ? width : !!variant ? undefined : height,
            }}
            className={`${styles.root} ${styles[variant]} ${circular ? styles.circular : ""} ${className}`}
            {...rest}
        />
    );
}

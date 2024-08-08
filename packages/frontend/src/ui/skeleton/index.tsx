import classNames from "@/src/utils/classes";

import styles from "./styles.module.css";

type SkeletonVariant = "xs" | "sm" | "base" | "lg";

export interface SkeletonProps {
    variant?: SkeletonVariant;
    circular?: boolean;
    width?: number | string;
    height?: number | string;
    className?: { root?: string };
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
            className={classNames(className?.root, styles.root, {
                [styles[variant]]: true,
                [styles.cirular]: !!circular,
            })}
            {...rest}
        />
    );
}

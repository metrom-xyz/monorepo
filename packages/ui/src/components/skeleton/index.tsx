import classNames from "classnames";
import type { TypographySize } from "../typography";

import styles from "./styles.module.css";

type Skeletonsize = TypographySize;

export interface SkeletonProps {
    size?: Skeletonsize;
    circular?: boolean;
    width?: number | string;
    height?: number | string;
    className?: string;
}

export function Skeleton({
    size = "base",
    circular,
    width,
    height,
    className,
    ...rest
}: SkeletonProps) {
    return (
        <span
            style={{
                maxWidth: width,
                height: circular ? width : size ? undefined : height,
            }}
            className={classNames(styles.root, className, {
                [styles[size]]: true,
            })}
            {...rest}
        >
            <span
                className={classNames("skeleton", styles.skeleton, {
                    [styles.circular]: circular,
                })}
            ></span>
        </span>
    );
}

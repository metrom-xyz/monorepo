import type { TextSizes } from "../typography/types";

export interface SkeletonProps extends TextSizes {
    circular?: boolean;
    width?: number | string;
    height?: number | string;
}

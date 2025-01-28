import React, { type FC, type ReactElement, type ReactNode } from "react";

export function matchChildByType<P>(
    child: ReactNode,
    type: FC<P>,
): child is ReactElement<P> {
    return React.isValidElement<P>(child) && child.type === type;
}

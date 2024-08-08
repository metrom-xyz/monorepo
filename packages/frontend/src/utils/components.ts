import React, { type FC, type ReactNode } from "react";

export function matchChildByType<T extends FC<any>>(child: ReactNode, type: T) {
    return React.isValidElement(child) && child.type === type;
}

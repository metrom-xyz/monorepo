import type { SVGProps } from "react";

export enum Theme {
    System = "system",
    Dark = "dark",
    Light = "light",
}

export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

import type { SVGIcon } from "../types/common";

export function TrendUpIcon(props: SVGIcon) {
    return (
        <svg
            width="7"
            height="5"
            viewBox="0 0 7 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M6.5 0.5L3.7 3.3L2.63333 1.7L0.5 3.83333"
                stroke="#0EA400"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.16699 0.5H6.50033V1.83333"
                stroke="#0EA400"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

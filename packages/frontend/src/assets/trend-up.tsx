import type { SVGIcon } from "../types/common";

export function TrendUpIcon(props: SVGIcon) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M11 6.3335L8.2 9.1335L7.13333 7.5335L5 9.66683"
                stroke="#0EA400"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.66699 6.3335H11.0003V7.66683"
                stroke="#0EA400"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

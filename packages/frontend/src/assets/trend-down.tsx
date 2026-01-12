import type { SVGIcon } from "../types/common";

export function TrendDownIcon(props: SVGIcon) {
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
                d="M11 9.66683L8.2 6.86683L7.13333 8.46683L5 6.3335"
                stroke="#DC2626"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.66699 9.66683H11.0003V8.3335"
                stroke="#DC2626"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

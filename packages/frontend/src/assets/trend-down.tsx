import type { SVGIcon } from "../types/common";

export function TrendDownIcon(props: SVGIcon) {
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
                d="M6.5 3.83333L3.7 1.03333L2.63333 2.63333L0.5 0.5"
                stroke="#DC2626"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.16699 3.83333H6.50033V2.5"
                stroke="#DC2626"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

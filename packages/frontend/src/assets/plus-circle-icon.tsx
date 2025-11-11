import type { SVGIcon } from "../types/common";

export function PlusCircleIcon(props: SVGIcon) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_1152_52256)">
                <path
                    d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                    stroke="currentColor"
                    strokeWidth="0.925926"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6 4V8"
                    stroke="currentColor"
                    strokeWidth="0.925926"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4 6H8"
                    stroke="currentColor"
                    strokeWidth="0.925926"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1152_52256">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

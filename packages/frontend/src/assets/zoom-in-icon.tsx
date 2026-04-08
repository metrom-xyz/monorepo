import type { SVGIcon } from "../types/common";

export function ZoomInIcon(props: SVGIcon) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M4.59961 5.84961H7.09961"
                stroke="currentColor"
                strokeWidth="0.857143"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.84961 7.09961V4.59961"
                stroke="currentColor"
                strokeWidth="0.857143"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.75 10.5C8.37335 10.5 10.5 8.37335 10.5 5.75C10.5 3.12665 8.37335 1 5.75 1C3.12665 1 1 3.12665 1 5.75C1 8.37335 3.12665 10.5 5.75 10.5Z"
                stroke="currentColor"
                strokeWidth="0.857143"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 11L10 10"
                stroke="currentColor"
                strokeWidth="0.857143"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

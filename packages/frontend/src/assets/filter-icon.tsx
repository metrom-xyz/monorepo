import type { SVGIcon } from "../types/common";

export function FilterIcon(props: SVGIcon) {
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
                d="M3.59993 1.3999H12.3999C13.1333 1.3999 13.7333 1.9999 13.7333 2.73324V4.1999C13.7333 4.73324 13.3999 5.3999 13.0666 5.73324L10.1999 8.26657C9.79993 8.5999 9.53327 9.26657 9.53327 9.7999V12.6666C9.53327 13.0666 9.2666 13.5999 8.93327 13.7999L7.99994 14.3999C7.13327 14.9332 5.93327 14.3332 5.93327 13.2666V9.73324C5.93327 9.26657 5.6666 8.66657 5.39994 8.33324L2.8666 5.66657C2.53327 5.33324 2.2666 4.73324 2.2666 4.33324V2.7999C2.2666 1.9999 2.8666 1.3999 3.59993 1.3999Z"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.28667 1.3999L4 6.66657"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

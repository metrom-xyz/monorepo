import type { SVGIcon } from "../types/common";

export function FilterActiveIcon(props: SVGIcon) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_645_15191)">
                <path
                    d="M3.59993 1.40015H12.3999C13.1333 1.40015 13.7333 2.00015 13.7333 2.73348V4.20015C13.7333 4.73348 13.3999 5.40015 13.0666 5.73348L10.1999 8.26681C9.79993 8.60015 9.53327 9.26681 9.53327 9.80015V12.6668C9.53327 13.0668 9.2666 13.6001 8.93327 13.8001L7.99994 14.4001C7.13327 14.9335 5.93327 14.3335 5.93327 13.2668V9.73348C5.93327 9.26681 5.6666 8.66681 5.39994 8.33348L2.8666 5.66681C2.53327 5.33348 2.2666 4.73348 2.2666 4.33348V2.80015C2.2666 2.00015 2.8666 1.40015 3.59993 1.40015Z"
                    stroke="currentColor"
                    strokeWidth="0.666667"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M7.28667 1.40015L4 6.66681"
                    stroke="currentColor"
                    strokeWidth="0.666667"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <rect x="8" width="8" height="8" rx="4" fill="#6CFF95" />
            </g>
            <defs>
                <clipPath id="clip0_645_15191">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

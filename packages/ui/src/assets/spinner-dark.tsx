import type { SVGIcon } from "./types";

export function SpinnerDarkIcon(props: SVGIcon) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M10 2.5C14.1417 2.5 17.5 5.85833 17.5 10C17.5 14.1417 14.1417 17.5 10 17.5C5.85833 17.5 2.5 14.1417 2.5 10C2.5 5.85833 5.85833 2.5 10 2.5Z"
                stroke="#737373"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 2.5C14.1417 2.5 17.5 5.85833 17.5 10"
                stroke="#F5F5F5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

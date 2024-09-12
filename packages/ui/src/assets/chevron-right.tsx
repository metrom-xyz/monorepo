import type { SVGIcon } from "./types";

export function ChevronRight(props: SVGIcon) {
    return (
        <svg
            fill="none"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="m7.3959 5 5 5-5 5"
                stroke="currentColor"
                strokeLinecap="round"
            />
        </svg>
    );
}

import type { SVGIcon } from "../types/common";

export function GreenCheckIcon(props: SVGIcon) {
    return (
        <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M9 1L3.5 6.5L1 4"
                stroke="#6CFF95"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import type { SVGIcon } from "./types";

export function ArrowRight(props: SVGIcon) {
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
                d="M7.21503 2.96497L10.25 5.99997L7.21503 9.03497"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.75 6H10.165"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

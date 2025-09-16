import { SVGIcon } from "../types";

export function ArrowRightIcon(props: SVGIcon) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            {...props}
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
                d="M14.93 5.93 21 12l-6.07 6.07M4 12h16.83"
            />
        </svg>
    );
}

import type { SVGIcon } from "../types/common";

export function IncreasingAprIcon(props: SVGIcon) {
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
                d="M1.33203 1.3335V12.6668C1.33203 13.7735 2.22536 14.6668 3.33203 14.6668H14.6654"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.33203 11.3332L6.39203 7.75985C6.8987 7.17318 7.7987 7.13317 8.34537 7.6865L8.9787 8.31984C9.52536 8.86651 10.4254 8.83317 10.932 8.2465L13.9987 4.6665"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

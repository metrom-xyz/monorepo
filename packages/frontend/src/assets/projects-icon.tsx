import type { SVGIcon } from "../types/common";

export function ProjectsIcon(props: SVGIcon) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M9 12.75V14.535C9 15.9375 8.4375 16.5 7.0275 16.5H3.465C2.0625 16.5 1.5 15.9375 1.5 14.535V10.9725C1.5 9.5625 2.0625 9 3.465 9H5.25V10.7775C5.25 12.1875 5.8125 12.75 7.215 12.75H9Z"
                stroke="currentColor"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.75 9V10.7775C12.75 12.1875 12.1875 12.75 10.7775 12.75H7.215C5.8125 12.75 5.25 12.1875 5.25 10.7775V7.215C5.25 5.8125 5.8125 5.25 7.215 5.25H9V7.0275C9 8.4375 9.5625 9 10.965 9H12.75Z"
                stroke="currentColor"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.5 3.465V7.0275C16.5 8.4375 15.9375 9 14.5275 9H10.965C9.5625 9 9 8.4375 9 7.0275V3.465C9 2.0625 9.5625 1.5 10.965 1.5H14.5275C15.9375 1.5 16.5 2.0625 16.5 3.465Z"
                stroke="currentColor"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

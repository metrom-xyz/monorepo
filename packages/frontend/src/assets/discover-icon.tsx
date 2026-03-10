import type { SVGIcon } from "../types/common";

export function DiscoverIcon(props: SVGIcon) {
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
                d="M9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.36573 6.92815L11.751 6.25073L11.0736 9.63598C11.0026 9.9908 10.8283 10.3167 10.5726 10.5726C10.3168 10.8286 9.991 11.0031 9.63623 11.0742L6.25098 11.7507L6.92839 8.36548C6.99947 8.01084 7.17386 7.68514 7.42962 7.42938C7.68538 7.17362 8.01108 6.99922 8.36573 6.92815Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import type { SVGIcon } from "./types";

export function ErrorIcon(props: SVGIcon) {
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
                d="M6 4.5V7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.99972 10.7056H2.96972C1.23472 10.7056 0.509722 9.46562 1.34972 7.95062L2.90972 5.14062L4.37972 2.50063C5.26972 0.895625 6.72972 0.895625 7.61972 2.50063L9.08972 5.14563L10.6497 7.95563C11.4897 9.47063 10.7597 10.7106 9.02972 10.7106H5.99972V10.7056Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.99805 8.5H6.00254"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

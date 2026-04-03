import type { SVGIcon } from "../types/common";

export function PencilIcon(props: SVGIcon) {
    return (
        <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M5.35202 1.3738L5.92952 0.796307C6.40797 0.317898 7.18363 0.317898 7.66202 0.796307C8.14042 1.27472 8.14042 2.05037 7.66202 2.52879L7.08452 3.10628M5.35202 1.3738L1.46742 5.2584C1.17137 5.5545 0.961357 5.92538 0.859816 6.33156L0.4375 8.02083L2.12677 7.5985C2.53295 7.497 2.90383 7.28694 3.19993 6.9909L7.08452 3.10628M5.35202 1.3738L7.08452 3.10628"
                stroke="currentColor"
                strokeWidth="0.875"
                strokeLinejoin="round"
            />
        </svg>
    );
}

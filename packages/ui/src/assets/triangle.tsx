import type { SVGIcon } from "./types";

export function Triagle(props: SVGIcon) {
    return (
        <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M0.555623 4.96237C-0.185207 4.53465 -0.185208 3.46535 0.555622 3.03763L5.55622 0.150537C6.29705 -0.277182 7.22309 0.257465 7.22309 1.1129L7.22309 6.8871C7.22309 7.74253 6.29705 8.27718 5.55622 7.84946L0.555623 4.96237Z"
                fill="currentColor"
            />
        </svg>
    );
}

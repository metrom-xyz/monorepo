import type { SVGIcon } from "../types/common";

export function CappedRewardRateIcon(props: SVGIcon) {
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
        </svg>
    );
}

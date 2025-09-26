import type { SVGIcon } from "../types/common";

export function NewCampaignIcon(props: SVGIcon) {
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
                d="M6.37244 11.3333V8"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.99996 9.66602H4.66663"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.6667 6.66732V10.0007C14.6667 13.334 13.3334 14.6673 10 14.6673H6.00004C2.66671 14.6673 1.33337 13.334 1.33337 10.0007V6.00065C1.33337 2.66732 2.66671 1.33398 6.00004 1.33398H9.33337"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.6667 6.66732H12C10 6.66732 9.33337 6.00065 9.33337 4.00065V1.33398L14.6667 6.66732Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

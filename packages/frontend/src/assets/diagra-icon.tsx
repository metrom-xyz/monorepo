import type { SVGIcon } from "../types/common";

export function DiagramIcon(props: SVGIcon) {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M2.33398 2.3335V22.1668C2.33398 24.1035 3.89732 25.6668 5.83398 25.6668H25.6673"
                stroke="#A3A3A3"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24.5 19.8332L19.145 13.5799C18.2583 12.5532 16.6833 12.4832 15.7267 13.4515L14.6183 14.5599C13.6617 15.5165 12.0867 15.4582 11.2 14.4315L5.83333 8.1665"
                stroke="#A3A3A3"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

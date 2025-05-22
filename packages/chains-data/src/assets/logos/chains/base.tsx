import { SVGIcon } from "../../../types/common";

export function BaseLogo(props: SVGIcon) {
    return (
        <svg
            width="111"
            height="111"
            viewBox="0 0 111 111"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_573_2038)">
                <path
                    d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
                    fill="#0052FF"
                />
            </g>
            <defs>
                <clipPath id="clip0_573_2038">
                    <rect width="111" height="111" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

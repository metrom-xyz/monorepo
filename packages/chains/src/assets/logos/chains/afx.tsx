import { SVGIcon } from "../../../types/common";

export function AfxLogo(props: SVGIcon) {
    return (
        <svg
            width="392"
            height="200"
            viewBox="0 0 392 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M79.5 200H0L221.27 27.1329C243.775 9.55081 271.514 0 300.072 0H391.5L294 200H226L303.5 42H299.446C288.786 42 278.43 45.5486 270.009 52.086L79.5 200Z"
                fill="currentColor"
            />
            <path
                d="M80.6328 137L312 136.85L368.391 92.9521H137.023L80.6328 137Z"
                fill="url(#paint0_linear)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear"
                    x1="368.391"
                    y1="114.976"
                    x2="80.5"
                    y2="114.976"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#03C4A7" />
                    <stop offset="0.480769" stop-color="#46DF75" />
                    <stop offset="1" stop-color="#8EFD40" />
                </linearGradient>
            </defs>
        </svg>
    );
}

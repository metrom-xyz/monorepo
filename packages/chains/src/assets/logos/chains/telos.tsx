import { SVGIcon } from "../../../types/common";

export function TelosLogo(props: SVGIcon) {
    return (
        <svg
            width="256"
            height="256"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_2065_15434)">
                <path
                    d="M128 256C57.4254 256 0 198.575 0 128C0 57.4254 57.4254 0 128 0C198.575 0 256 57.4254 256 128C256 198.575 198.575 256 128 256ZM128 46.5455C83.0836 46.5455 46.5455 83.0836 46.5455 128C46.5455 172.916 83.0836 209.455 128 209.455C172.916 209.455 209.455 172.916 209.455 128C209.455 83.0836 172.916 46.5455 128 46.5455Z"
                    fill="url(#paint0_linear_2065_15434)"
                />
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_2065_15434"
                    x1="34.2421"
                    y1="37.7301"
                    x2="205.363"
                    y2="258.533"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00F2FE" />
                    <stop offset="0.535" stopColor="#4FACFE" />
                    <stop offset="0.975" stopColor="#C471F5" />
                </linearGradient>
                <clipPath id="clip0_2065_15434">
                    <rect width="256" height="256" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

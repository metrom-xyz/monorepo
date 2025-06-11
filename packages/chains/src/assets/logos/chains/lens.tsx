import { SVGIcon } from "../../../types/common";

export function LensLogo(props: SVGIcon) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            {...props}
        >
            <g clipPath="url(#a)">
                <path
                    fill="currentColor"
                    d="M12.975 5.217c-.753 0-1.429.32-1.944.835l-.052-.028C10.86 4.334 9.59 3 8 3 6.409 3 5.14 4.333 5.021 6.024l-.053.028c-.514-.515-1.19-.835-1.943-.835C1.355 5.217 0 6.685 0 8.497c0 1.565 1.434 2.907 1.79 3.215A9.48 9.48 0 0 0 8 14a9.48 9.48 0 0 0 6.21-2.288c.358-.308 1.79-1.648 1.79-3.215 0-1.812-1.355-3.28-3.027-3.28h.002Z"
                    style={{
                        fill: "currentColor",
                        fillOpacity: 1,
                    }}
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path
                        fill="#fff"
                        d="M0 0h16v16H0z"
                        style={{
                            fill: "#fff",
                            fillOpacity: 1,
                        }}
                    />
                </clipPath>
            </defs>
        </svg>
    );
}

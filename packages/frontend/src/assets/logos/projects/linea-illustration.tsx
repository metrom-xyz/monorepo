import type { SVGIcon } from "@/src/types/common";

export function LineaIllustration(props: SVGIcon) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={308}
            height={195}
            fill="none"
            {...props}
        >
            <g opacity={0.24}>
                <mask
                    id="a"
                    width={187}
                    height={195}
                    x={61}
                    y={0}
                    maskUnits="userSpaceOnUse"
                    style={{
                        maskType: "luminance",
                    }}
                >
                    <path fill="#fff" d="M247.68 0H61v195h186.68V0Z" />
                </mask>
                <g fill="#F9FAFB" mask="url(#a)">
                    <path d="M216.04 194.999H61.001V31.642h35.473V163.34H216.04v31.659ZM216.039 63.284c17.476 0 31.642-14.166 31.642-31.642C247.681 14.167 233.515 0 216.039 0c-17.477 0-31.642 14.167-31.642 31.642 0 17.476 14.165 31.642 31.642 31.642Z" />
                </g>
            </g>
        </svg>
    );
}

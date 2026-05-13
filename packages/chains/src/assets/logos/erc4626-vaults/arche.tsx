import { SVGIcon } from "../../../types/common";

export function ArcheLogo(props: SVGIcon) {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 120 120"
            fill="none"
            {...props}
        >
            <ellipse
                cx="60"
                cy="65"
                rx="25"
                ry="30"
                fill="rgba(196, 242, 74, 0.08)"
                opacity="0"
            ></ellipse>
            <path
                d="M14 104 L14 48 Q14 10 60 10 Q106 10 106 48 L106 104"
                stroke="#c4f24a"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="0"
            ></path>
            <path
                d="M34 104 L34 56 Q34 28 60 28 Q86 28 86 56 L86 104"
                stroke="#c4f24a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="0"
            ></path>
        </svg>
    );
}

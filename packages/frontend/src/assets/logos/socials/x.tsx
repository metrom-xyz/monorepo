import type { SVGIcon } from "@/src/types/common";

export function XLogo(props: SVGIcon) {
    return (
        <svg
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M17.1203 0.244629H20.3842L13.2534 8.39463L21.6422 19.4849H15.0739L9.92931 12.7587L4.04275 19.4849H0.776833L8.40389 10.7676L0.356506 0.244629H7.09161L11.7418 6.39265L17.1203 0.244629ZM15.9747 17.5313H17.7833L6.10887 2.09565H4.16806L15.9747 17.5313Z"
                fill="currentColor"
            />
        </svg>
    );
}

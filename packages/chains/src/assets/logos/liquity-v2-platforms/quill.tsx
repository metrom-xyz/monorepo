import { SVGIcon } from "../../../types/common";

export function QuillLogo(props: SVGIcon) {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="9.5" cy="9.5" r="7.5" fill="white" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.49998 0C4.25329 0 0 4.25329 0 9.49998C0 14.7467 4.25329 19 9.49998 19C14.7467 19 19 14.7467 19 9.49998C19 4.25329 14.7467 0 9.49998 0ZM14.5134 8.05228H12.8061C12.1692 8.05228 11.5719 8.36177 11.2046 8.88209L9.55053 11.2254C8.74246 12.3701 7.42855 13.051 6.02731 13.051H4.61404V10.6987H6.02731C6.66423 10.6987 7.26144 10.3892 7.62875 9.86885L9.28286 7.52557C10.0909 6.38079 11.4048 5.69999 12.8061 5.69999H14.5134V8.05228Z"
                fill="#FF5500"
            />
        </svg>
    );
}

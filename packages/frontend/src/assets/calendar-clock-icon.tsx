import type { SVGIcon } from "@metrom-xyz/chains";

export function CalendarClockIcon(props: SVGIcon) {
    return (
        <svg
            width="25"
            height="26"
            viewBox="0 0 25 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M16.1667 15V17.5667L18.0333 18.7333M16.1667 1V5.66667M22 7.41667V5.66667C22 5.04783 21.7542 4.45434 21.3166 4.01675C20.879 3.57917 20.2855 3.33333 19.6667 3.33333H3.33333C2.71449 3.33333 2.121 3.57917 1.68342 4.01675C1.24583 4.45434 1 5.04783 1 5.66667V22C1 22.6188 1.24583 23.2123 1.68342 23.6499C2.121 24.0875 2.71449 24.3333 3.33333 24.3333H7.41667M1 10.3333H6.83333M6.83333 1V5.66667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.167 24.3333C20.033 24.3333 23.167 21.1992 23.167 17.3333C23.167 13.4673 20.033 10.3333 16.167 10.3333C12.301 10.3333 9.16699 13.4673 9.16699 17.3333C9.16699 21.1992 12.301 24.3333 16.167 24.3333Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

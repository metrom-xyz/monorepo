import type { SVGIcon } from "./types";

export function Check(props: SVGIcon) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.23155 0.975273C9.53971 1.17677 9.62622 1.58993 9.42473 1.89809L4.89138 8.83144C4.78455 8.99486 4.61146 9.10312 4.41782 9.12787C4.22416 9.15262 4.02941 9.09118 3.88495 8.95987L0.951619 6.29321C0.679182 6.04554 0.659107 5.62391 0.906776 5.35148C1.15445 5.07904 1.57608 5.05895 1.84851 5.30663L4.20331 7.44735L8.30878 1.16842C8.51027 0.860265 8.92339 0.77379 9.23155 0.975273Z"
                fill="currentColor"
            />
        </svg>
    );
}

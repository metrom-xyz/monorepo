export function SpinnerIcon(props: any) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_1138_27059)">
                <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="#1F2937"
                    strokeWidth="2"
                />
                <mask
                    id="mask0_1138_27059"
                    style={{
                        maskType: "alpha",
                    }}
                    maskUnits="userSpaceOnUse"
                    x="12"
                    y="12"
                    width="12"
                    height="12"
                >
                    <rect x="12" y="12" width="12" height="12" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_1138_27059)">
                    <circle
                        cx="12"
                        cy="12"
                        r="11"
                        stroke="white"
                        strokeWidth="2"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_1138_27059">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

import { SVGIcon } from "../../../types/common";
import { useSvgIds } from "../../../hooks/useSvgIds";

export function LightLinkPhoenixLogo(props: SVGIcon) {
    const svg = useSvgIds();

    return (
        <svg
            width="168"
            height="106"
            viewBox="0 0 168 106"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M60.8482 60.2011C56.7237 64.0679 56.7237 70.4867 60.8482 74.4309L91.205 102.89C95.412 106.834 102.176 106.834 106.383 102.89C110.508 99.0235 110.508 92.6047 106.383 88.6606L76.0266 60.2011C71.9021 56.3343 65.0553 56.3343 60.8482 60.2011Z"
                fill={svg.url("a")}
            />
            <path
                d="M164.045 48.8337C168.252 44.8896 168.252 38.548 164.045 34.6039C159.92 30.7372 153.073 30.7372 148.866 34.6039L106.383 74.4317C102.176 78.3759 102.919 77.6798 98.7942 81.5466C89.3902 90.3628 76.5216 88.9708 72.3145 85.104L91.205 102.814C95.3296 106.681 102.176 106.681 106.383 102.814L164.045 48.8337Z"
                fill={svg.url("b")}
            />
            <path
                d="M106.631 46.1272C110.756 42.2605 110.756 35.8416 106.631 31.8975L76.2746 3.43806C72.0676 -0.506047 65.3033 -0.506047 61.0962 3.43806C56.9716 7.30484 56.9716 13.7237 61.0962 17.6678L91.453 46.1272C95.66 49.994 102.424 49.994 106.631 46.1272Z"
                fill={svg.url("c")}
            />
            <path
                d="M3.43529 57.5714C-0.77176 61.5155 -0.77176 67.857 3.43529 71.8011C7.55985 75.6679 14.4066 75.6679 18.6137 71.8011L61.0966 31.896C65.3037 27.9519 64.5613 28.6479 68.6858 24.7811C78.0898 15.9649 90.9584 17.3569 95.1655 21.2237L76.275 3.51385C72.1505 -0.352924 65.3037 -0.352924 61.0966 3.51385L3.43529 57.5714Z"
                fill={svg.url("d")}
            />
            <defs>
                <linearGradient
                    id={svg.id("a")}
                    x1="32.3054"
                    y1="34.0108"
                    x2="106.133"
                    y2="111.828"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.1173" stopColor="#6978FF" />
                    <stop offset="0.1876" stopColor="#6087FF" />
                    <stop offset="0.3484" stopColor="#4DA5FF" />
                    <stop offset="0.5073" stopColor="#40BAFF" />
                    <stop offset="0.6622" stopColor="#39C7FF" />
                    <stop offset="0.8083" stopColor="#36CBFF" />
                    <stop offset="1" stopColor="#67FFFC" />
                </linearGradient>
                <linearGradient
                    id={svg.id("b")}
                    x1="15.4114"
                    y1="166.035"
                    x2="233.717"
                    y2="-73.331"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.386" stopColor="#6978FF" />
                    <stop offset="0.4432" stopColor="#6284FF" />
                    <stop offset="0.6461" stopColor="#4AABFF" />
                    <stop offset="0.8086" stopColor="#3BC2FF" />
                    <stop offset="0.9094" stopColor="#36CBFF" />
                    <stop offset="1" stopColor="#67FFFC" />
                </linearGradient>
                <linearGradient
                    id={svg.id("c")}
                    x1="72.0368"
                    y1="10.0136"
                    x2="97.6387"
                    y2="46.4252"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.1173" stopColor="#6978FF" />
                    <stop offset="0.1876" stopColor="#6087FF" />
                    <stop offset="0.3484" stopColor="#4DA5FF" />
                    <stop offset="0.5073" stopColor="#40BAFF" />
                    <stop offset="0.6622" stopColor="#39C7FF" />
                    <stop offset="0.8083" stopColor="#36CBFF" />
                    <stop offset="1" stopColor="#67FFFC" />
                </linearGradient>
                <linearGradient
                    id={svg.id("d")}
                    x1="-32.782"
                    y1="129.899"
                    x2="69.8701"
                    y2="1.08063"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.3128" stopColor="#6978FF" />
                    <stop offset="0.3633" stopColor="#6087FF" />
                    <stop offset="0.4785" stopColor="#4DA5FF" />
                    <stop offset="0.5925" stopColor="#40BAFF" />
                    <stop offset="0.7035" stopColor="#39C7FF" />
                    <stop offset="0.8083" stopColor="#36CBFF" />
                    <stop offset="1" stopColor="#67FFFC" />
                </linearGradient>
            </defs>
        </svg>
    );
}

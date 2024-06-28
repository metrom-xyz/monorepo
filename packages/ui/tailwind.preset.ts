import { type Config } from "tailwindcss";

const fontSizeToHeight = (size: string, percentage: number) =>
    `${Number(size.replace("rem", "")) * percentage}rem`;

export default {
    darkMode: ["class", '[class~="dark"]'],
    plugins: [],
    theme: {
        fontFamily: {
            inter: ["Inter", "sans-serif"],
        },
        colors: {
            blue: {
                200: "#70D7FF",
                DEFAULT: "#007AFF",
                600: "#005ADF",
                900: "#002274",
            },
            green: {
                200: "#E4F7EA",
                DEFAULT: "#6CFF95",
                600: "#48D080",
                900: "#2C7A3F",
            },
            yellow: "#FFD60A",
            transparent: "transparent",
            current: "currentColor",
            white: "#ffffff",
            black: "#000000",
            "red-light": "#FF6482",
            gray: {
                700: "#656363",
                600: "#999",
                500: "#DEDEDE",
                400: "#E6E6E6",
                300: "#E7E7E7",
                200: "#F5F0F0",
                100: "#F8F7FC",
            },
        },
        fontSize: {
            xs: "0.563rem",
            sm: "0.75rem",
            base: "0.875rem",
            lg: "1.125rem",
            xl: "1.5rem",
            h1: [
                "3.5rem",
                {
                    fontWeight: 800,
                    letterSpacing: "0%",
                    lineHeight: "110%",
                },
            ],
            h2: [
                "2.25rem",
                {
                    fontWeight: 800,
                    letterSpacing: "0%",
                    lineHeight: "110%",
                },
            ],
            h3: [
                "1.5rem",
                {
                    fontWeight: 800,
                    letterSpacing: "0%",
                    lineHeight: "110%",
                },
            ],
            h4: [
                "1.3125rem",
                {
                    fontWeight: 400,
                    letterSpacing: "0%",
                    lineHeight: "110%",
                },
            ],
        },
        extend: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            height({ theme }: { theme: any }) {
                return {
                    xs: fontSizeToHeight(theme("fontSize.xs"), 1.46),
                    sm: fontSizeToHeight(theme("fontSize.sm"), 1.46),
                    base: fontSizeToHeight(theme("fontSize.base"), 1.46),
                    lg: fontSizeToHeight(theme("fontSize.lg"), 1.46),
                    xl: fontSizeToHeight(theme("fontSize.xl"), 1.46),
                    h4: fontSizeToHeight(theme("fontSize.h4")[0], 1.24),
                    h3: fontSizeToHeight(theme("fontSize.h3")[0], 1.24),
                    h2: fontSizeToHeight(theme("fontSize.h2")[0], 1.24),
                    h1: fontSizeToHeight(theme("fontSize.h1")[0], 1.24),
                };
            },
            borderRadius: {
                xxl: "16px",
            },
            backgroundSize: {
                2: "2rem 2rem",
                3: "3.1rem 3.1rem",
                4: "4rem 4rem",
            },
            backgroundImage: {
                dots:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px), " +
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px)",
            },
            gridTemplateColumns: {
                campaignsTable: "3fr 2.8fr 1.5fr 1fr 1fr",
            },
        },
    },
} as Omit<Config, "content">;

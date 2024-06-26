import { type Config } from "tailwindcss";

export default {
    darkMode: ["class", '[class~="dark"]'],
    plugins: [],
    theme: {
        fontFamily: {
            inter: ["Inter", "sans-serif"],
        },
        colors: {
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
            h1: [
                "3.5rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h2: [
                "2.25rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h3: [
                "1.5rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h4: [
                "1.3125rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
        },
        extend: {
            backgroundSize: {
                2: "2rem 2rem",
                3: "3.1rem 3.1rem",
                4: "4rem 4rem",
            },
            backgroundImage: {
                dots:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px), " +
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px)",
                "hero-background": "url(/hero-background.png)",
            },
        },
    },
} as Omit<Config, "content">;

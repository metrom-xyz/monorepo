import { type Config } from "tailwindcss";

const SANS_FONT_FAMILY = ["IBM Plex Sans", "ui-sans-serif", "sans-serif"];
const MONO_FONT_FAMILY = ["IBM Plex Mono", "ui-monospace", "monospace"];

const BODY_TEXT_SIZES_REM = {
    // TODO: add missing sizes
    xl5: "3rem",
    xl4: "2.25rem",
    lg: "1.125rem",
    base: "1rem",
    sm: "0.875rem",
    xs: "0.75rem",
};

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    plugins: [],
    theme: {
        extend: {
            fontFamily: {
                sans: SANS_FONT_FAMILY,
                mono: MONO_FONT_FAMILY,
            },
            fontSize: { ...BODY_TEXT_SIZES_REM, inherit: "inherit" },
            colors: {
                "brand-green": "#6CFF95",
                "brand-blue": "#3C82F6",
                black: "#000000",
                white: "#FFFFFF",
            },
            transitionProperty: {
                colors: "border-radius, color, background-color, border-color, text-decoration-color, fill, stroke",
            },
            gridTemplateColumns: {
                "campaigns-table": "0.5fr 3.5fr 1fr 1fr 1fr",
                rewardRow: "1.5fr 1.5fr 1fr 0.5fr",
            },
            backgroundImage: {
                dots:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px), " +
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px)",
            },
        },
    },
};

export default config;

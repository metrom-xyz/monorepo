import { type Config } from "tailwindcss";

const SANS_FONT_FAMILY = ["IBM Plex Sans", "ui-sans-serif", "sans-serif"];
const MONO_FONT_FAMILY = ["IBM Plex Mono", "ui-monospace", "monospace"];

const BODY_TEXT_SIZES_REM = {
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
                brandGreen: "#6CFF95",
                black: "#000000",
                white: "#FFFFFF",
            },
            borderRadius: {
                // "3xl": "1.875rem",
                // xl: "0.75rem",
            },
            transitionProperty: {
                colors: "border-radius, color, background-color, border-color, text-decoration-color, fill, stroke",
            },
            gridTemplateColumns: {
                campaignsTable: "3fr 2.8fr 1.5fr 1fr 1fr",
                campaignsTableSm: "2.1fr 2.2fr 1.5fr 1fr",
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

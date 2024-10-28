import type { Config } from "tailwindcss";

export const tailwindPreset: Partial<Config> = {
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["IBM Plex Sans", "ui-sans-serif", "sans-serif"],
                mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
            },
            fontSize: {
                // TODO: add missing sizes
                xl5: "3rem",
                xl4: "2.25rem",
                xl2: "1.5rem",
                xl: "1.25rem",
                lg: "1.125rem",
                base: "1rem",
                sm: "0.875rem",
                xs: "0.75rem",
                inherit: "inherit",
            },
            colors: {
                "brand-green": "#6CFF95",
                "brand-blue": "#3C82F6",
                "carrot-orange": "#EF802B",
                black: "#000000",
                white: "#FFFFFF",
            },
            transitionProperty: {
                colors: "border-radius, color, background-color, border-color, text-decoration-color, fill, stroke",
            },
        },
    },
};

import { type Config } from "tailwindcss";
import { tailwindPreset } from "./src/tailwind-preset";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    presets: [tailwindPreset],
    theme: {
        extend: {
            transitionProperty: {
                colors: "border-radius, color, background-color, border-color, text-decoration-color, fill, stroke",
            },
        },
    },
};

export default config;

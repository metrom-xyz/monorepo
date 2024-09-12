import { type Config } from "tailwindcss";
import { tailwindPreset } from "@metrom-xyz/ui";

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
            gridTemplateColumns: {
                "campaigns-table": "auto 3.5fr 1.4fr 0.8fr 1fr",
                rewardRow: "1.2fr 1.2fr 1.5fr 0.2fr",
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

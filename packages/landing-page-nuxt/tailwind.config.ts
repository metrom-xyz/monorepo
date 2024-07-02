import { type Config } from "tailwindcss";
import metPreset from "@metrom-xyz/ui/tailwind.preset";

const config: Config = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    presets: [metPreset],
    theme: {
        extend: {
            backgroundImage: {
                "hero-background": "url(/hero-background.png)",
            },
        },
    },
};

export default config;

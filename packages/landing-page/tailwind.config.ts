import { type Config } from "tailwindcss";
import metPreset from "@metrom-xyz/ui/tailwind.preset";

const config: Config = {
    content: ["./src/**/*.{js,ts,vue}"],
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

import { type Config } from "tailwindcss";
import metPreset from "@metrom-xyz/ui/tailwind.preset";

const config: Config = {
    content: ["./src/**/*.{js,ts,vue}"],
    presets: [metPreset],
    theme: {
        extend: {
            gridTemplateColumns: {
                campaignsTable: "3fr 2.8fr 1.5fr 1fr 1fr",
                campaignsTableSm: "2.1fr 2.2fr 1.5fr 1fr",
            },
        },
    },
};

export default config;

import { type Config } from "tailwindcss";
import preset from "./tailwind.preset";

const config: Config = {
    content: ["./src/**/*.{js,ts,vue}", "./stories/**/*.{js,ts,vue}"],
    presets: [preset],
};

export default config;

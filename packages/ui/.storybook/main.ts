import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(ts)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-themes",
    ],
    framework: {
        name: "@storybook/vue3-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
};

export default config;

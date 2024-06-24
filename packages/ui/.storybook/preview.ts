import MetromUiPlugin from "../src";
import { setup } from "@storybook/vue3";
import { withThemeByClassName } from "@storybook/addon-themes";

import "@fontsource-variable/inter";

import "../src/index.css";

setup((app) => {
    app.use(MetromUiPlugin);
});

export const decorators = [
    withThemeByClassName({
        themes: {
            light: "light",
            dark: "dark",
        },
        defaultTheme: "light",
    }),
];

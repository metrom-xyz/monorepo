import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./global.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            values: [
                { name: "Dark", value: "#1e2939" },
                { name: "Light", value: "#FFFFFF" },
                { name: "Gray", value: "#F3F4F6" },
            ],
            options: [
                { name: "Dark", value: "#1e2939" },
                { name: "Light", value: "#FFFFFF" },
                { name: "Gray", value: "#F3F4F6" },
            ],
            default: "Light",
        },
        options: {
            storySort: {
                order: [
                    "Data display",
                    [
                        "Typography",
                        "Text field",
                        "Error text",
                        "Chip",
                        "Card",
                        "Remote logo",
                        "Pool remote logo",
                    ],
                    "Input",
                    [
                        "Button",
                        "Text",
                        "Number",
                        "Select",
                        "Slider",
                        "Date picker",
                        "Date time picker",
                        "Switch",
                        "Tabs",
                    ],
                    "Surfaces",
                    "Feedback",
                    "Utils",
                ],
            },
        },
    },
};

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            light: "light",
            dark: "dark",
        },
        defaultTheme: "light",
        attributeName: "data-theme",
        parentSelector: "html",
    }),
];

export default preview;

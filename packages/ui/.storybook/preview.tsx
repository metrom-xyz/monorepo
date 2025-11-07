import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { useEffect } from "react";

import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./global.css";

import { Theme } from "../src";

const preview: Preview = {
    decorators: [
        (Story, context) => {
            const theme: Theme = context.globals.theme || "dark";

            const backgrounds: Record<Theme, string> = {
                light: "#e5e7eb",
                dark: "#0a0a0a",
            };

            useEffect(() => {
                document.body.style.backgroundColor = backgrounds[theme];
                document.documentElement.setAttribute("data-theme", theme);
            }, [theme]);

            return (
                <div data-theme={theme}>
                    <Story />
                </div>
            );
        },
    ],
    parameters: {
        docs: {
            canvas: {
                className:
                    "bg-light-background-main! dark:bg-dark-background-main!",
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            disable: true,
            // options: {
            //     "surface-dark": { name: "Surface dark", value: "#202024" },
            //     light: { name: "Light", value: "#e5e7eb" },
            //     "surface-light": { name: "Surface light", value: "#ffffff" },
            //     dark: { name: "Dark", value: "#0a0a0a" },
            // },
        },
        options: {
            storySort: {
                order: [
                    "Data display",
                    [
                        "Typography",
                        "Text field",
                        "Error text",
                        "Info tooltip",
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
                        "Multi select",
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
    initialGlobals: {
        backgrounds: { value: "dark" },
    },
};

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            light: "light",
            dark: "dark",
        },
        defaultTheme: "dark",
        attributeName: "data-theme",
        parentSelector: "html",
    }),
];

export default preview;

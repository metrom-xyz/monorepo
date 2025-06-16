"use client";

import { type ReactNode } from "react";
import { TokenIconsProvider } from "./token-icon-provider";
import { Toaster } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import Fathom from "./fathom";
import { ReownAppKitContextProvider } from "../context/reown-app-kit";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const TurtleProvider = dynamic(
    () => import("@turtledev/react").then((mod) => mod.TurtleProvider),
    {
        ssr: false,
    },
);

// TODO: dynamic import for the theme config?
const defaultThemeConfig = {
    theme: "dark",
    shared: {
        borderRadius: "0.5rem",
        gap: "0.75rem",
        padding: "1rem",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        fontSize: "1rem",
        fontWeight: "400",
    },
    light: {
        bgPrimary: "rgba(230, 230, 230)",
        bgSecondary: "rgb(245, 245, 245)",
        bgAccent: "rgba(245, 245, 245)",
        bgTranslucent: "hsl(0 0% 10% / 0.25)",
        borderColor: "rgb(210, 210, 210)",
        textPrimary: "rgba(10, 10, 10)",
        textSecondary: "rgba(30, 30, 30)",
        buttonBgColor: "hsl(117, 85%, 69%)",
        buttonTextColor: "rgb(10, 10, 10)",
        errorColor: "rgb(247, 23, 53)",
    },
    dark: {
        bgPrimary: "rgb(32, 32, 34)",
        bgSecondary: "rgba(20, 20, 20)",
        bgAccent: "rgba(60, 60, 60)",
        bgTranslucent: "hsl(0 0% 90% / 0.25)",
        borderColor: "rgb(53, 53, 59)",
        textPrimary: "rgba(255, 255, 255)",
        textSecondary: "rgba(225, 225, 225)",
        buttonBgColor: "hsl(117, 85%, 69%)",
        buttonTextColor: "rgb(10, 10, 10)",
        errorColor: "rgb(246, 56, 85)",
    },
};

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const { resolvedTheme } = useTheme();

    return (
        <ReownAppKitContextProvider>
            <TokenIconsProvider>
                <TurtleProvider
                    themeConfig={{
                        ...defaultThemeConfig,
                        light: {
                            ...defaultThemeConfig.light,
                            bgPrimary: "#ffffff",
                            bgAccent: "#f4f4f5",
                            textPrimary: "#000000",
                            textSecondary: "#9ca3af",
                            borderColor: "transparent",
                        },
                        dark: {
                            ...defaultThemeConfig.dark,
                            bgPrimary: "#202024",
                            bgAccent: "#3f3f46",
                            textPrimary: "#d4d4d8",
                            textSecondary: "#9ca3af",
                            borderColor: "transparent",
                        },
                        theme: resolvedTheme as any,
                        shared: {
                            borderRadius: "0.5rem",
                            gap: "1rem",
                            padding: "1rem",
                            fontFamily:
                                "IBM Plex Sans, ui-sans-serif, sans-serif",
                            fontSize: "1rem",
                            fontWeight: "400",
                        },
                    }}
                >
                    <Fathom />
                    <Toaster />
                    {children}
                </TurtleProvider>
            </TokenIconsProvider>
        </ReownAppKitContextProvider>
    );
}

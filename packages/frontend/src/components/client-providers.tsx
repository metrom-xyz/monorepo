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
import { defaultThemeConfig, TurtleProvider } from "@turtledev/react";
import { useTheme } from "next-themes";

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

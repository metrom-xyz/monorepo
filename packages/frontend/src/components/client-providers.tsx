"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { type ReactNode } from "react";
import {
    getDefaultConfig,
    RainbowKitProvider,
    type Locale,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SUPPORTED_CHAINS } from "../commons";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const config = getDefaultConfig({
    appName: "Metrom",
    // TODO: actually set a project id here
    projectId: "YOUR_PROJECT_ID",
    chains: SUPPORTED_CHAINS,
    ssr: true,
});

const queryClient = new QueryClient();

export function ClientProviders({
    locale,
    children,
}: Readonly<{
    locale: Locale;
    children: ReactNode;
}>) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    appInfo={{
                        appName: "Metrom",
                        learnMoreUrl: "https://www.metrom.xyz",
                    }}
                    locale={locale}
                    theme={lightTheme({
                        // TODO: add primary color
                        accentColor: "#48D080",
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, type Locale } from "@rainbow-me/rainbowkit";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "wagmi/query";
import { TokenIconsProvider } from "./token-icon-provider";
import { Toaster } from "@metrom-xyz/ui";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { WALLETCONNECT_PROJECT_ID } from "../commons/env";
import { SUPPORTED_CHAINS } from "../commons";
import Fathom from "./fathom";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const config = getDefaultConfig({
    appName: "Metrom",
    projectId: WALLETCONNECT_PROJECT_ID || "PROJECT_ID",
    chains: SUPPORTED_CHAINS,
    ssr: true,
});

// TODO: if we need to have SSR prefetching https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#server-components--nextjs-app-router
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // FIXME: not sure why, but this is required after upgrading wagmi to the latest version to avoid
            // issues when serializing Bigint values in the react query queries. Remove this on next wagmi update.
            queryKeyHashFn: hashFn,
        },
    },
});

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
                <TokenIconsProvider>
                    <Fathom />
                    <Toaster />
                    <RainbowKitProvider
                        appInfo={{
                            appName: "Metrom",
                            learnMoreUrl: "https://www.metrom.xyz",
                        }}
                        locale={locale}
                        theme={lightTheme({
                            accentColor: "#000",
                        })}
                    >
                        {children}
                    </RainbowKitProvider>
                </TokenIconsProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

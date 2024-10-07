"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { type ReactNode } from "react";
import {
    getDefaultConfig,
    RainbowKitProvider,
    type Locale,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import {
    safeWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { hashFn } from "wagmi/query";
import { SUPPORTED_CHAINS } from "../commons";
import { WALLETCONNECT_PROJECT_ID } from "../commons/env";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { TokenIconsProvider } from "./token-icon-provider";
import { SafeProvider } from "./safe-provider";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const config = getDefaultConfig({
    appName: "Metrom",
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: SUPPORTED_CHAINS,
    wallets: [
        {
            groupName: "Popular",
            wallets: [
                safeWallet,
                coinbaseWallet,
                metaMaskWallet,
                walletConnectWallet,
                injectedWallet,
            ],
        },
    ],
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
                        <SafeProvider>{children}</SafeProvider>
                    </RainbowKitProvider>
                </TokenIconsProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

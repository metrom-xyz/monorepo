"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
    darkTheme,
    getDefaultConfig,
    type Locale,
} from "@rainbow-me/rainbowkit";
import {
    safeWallet,
    coinbaseWallet,
    walletConnectWallet,
    metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useMemo, type ReactNode } from "react";
import { http, WagmiProvider } from "wagmi";
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
import { SAFE, WALLETCONNECT_PROJECT_ID } from "../commons/env";
import { SUPPORTED_CHAINS } from "../commons";
import Fathom from "./fathom";
import { useTheme } from "next-themes";
import { Theme } from "../types/common";
import { sepolia } from "viem/chains";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const config = getDefaultConfig({
    appName: "Metrom",
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: SUPPORTED_CHAINS,
    transports: {
        [sepolia.id]: http(
            "https://endpoints.omniatech.io/v1/eth/sepolia/public",
        ),
    },
    wallets: [
        {
            groupName: "Popular",
            wallets: SAFE
                ? [safeWallet]
                : [coinbaseWallet, walletConnectWallet, metaMaskWallet],
        },
    ],
    ssr: true,
});

// TODO: if we need to have SSR prefetching https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#server-components--nextjs-app-router
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Needed to issues when serializing Bigint values in the react query queries.
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
    const { resolvedTheme } = useTheme();

    const theme = useMemo(() => {
        if (resolvedTheme === Theme.Light) return lightTheme();
        return darkTheme();
    }, [resolvedTheme]);

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
                        theme={theme}
                    >
                        {children}
                    </RainbowKitProvider>
                </TokenIconsProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

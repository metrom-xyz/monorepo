"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createAppKit,
    useAppKitTheme,
    type ThemeMode,
} from "@reown/appkit/react";
import React, { useEffect, type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { SUPPORTED_CHAINS } from "../commons";
import { hashFn } from "wagmi/query";
import { WALLETCONNECT_PROJECT_ID, SAFE } from "../commons/env";
import { useTheme } from "next-themes";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Set up queryClient
// TODO: if we need to have SSR prefetching https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#server-components--nextjs-app-router
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Needed to issues when serializing Bigint values in the react query queries.
            queryKeyHashFn: hashFn,
        },
    },
});

const wagmiAdapter = new WagmiAdapter({
    ssr: true,
    projectId: WALLETCONNECT_PROJECT_ID,
    networks: SUPPORTED_CHAINS,
});

createAppKit({
    adapters: [wagmiAdapter],
    projectId: WALLETCONNECT_PROJECT_ID,
    networks: SUPPORTED_CHAINS,
    metadata: {
        name: "Metrom",
        description: "Flexible liquidity mining platform",
        url: "https://app.metrom.xyz",
        icons: ["https://app.metrom.xyz/icons/icon-128x128.png"],
    },
    allWallets: SAFE ? "SHOW" : "HIDE",
    // https://docs.reown.com/cloud/wallets/wallet-list#wallets
    featuredWalletIds: SAFE
        ? [
              // safe
              "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",
          ]
        : [
              // coinbase
              "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
              // metamask
              "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          ],
    features: {
        socials: false,
        email: false,
        allWallets: false,
        analytics: false,
    },
    allowUnsupportedChain: true,
});

export function ReownAppKitContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { resolvedTheme } = useTheme();
    const { setThemeMode } = useAppKitTheme();
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig);

    useEffect(() => {
        setThemeMode(resolvedTheme as ThemeMode);
    }, [setThemeMode, resolvedTheme]);

    return (
        <WagmiProvider
            config={wagmiAdapter.wagmiConfig as Config}
            initialState={initialState}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

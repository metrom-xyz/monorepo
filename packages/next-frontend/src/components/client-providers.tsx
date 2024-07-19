"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { type ReactNode } from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SUPPORTED_CHAINS } from "@/utils/commons";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
    appName: "Metrom",
    // TODO: actually set a project id here
    projectId: "YOUR_PROJECT_ID",
    chains: SUPPORTED_CHAINS,
    ssr: true,
});

const queryClient = new QueryClient();

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

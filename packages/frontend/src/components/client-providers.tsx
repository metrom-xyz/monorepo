"use client";

import { type ReactNode } from "react";
import { TokenIconsProvider } from "./token-icon-provider";
import { Toaster } from "@metrom-xyz/ui";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import Fathom from "./fathom";
import { ReownAppKitContextProvider } from "../context/reown-app-kit";
import {
    APTOS_CLIENT_API_KEY,
    APTOS_CLIENT_TESTNET_API_KEY,
    ENVIRONMENT,
} from "../commons/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "wagmi/query";
import { Environment } from "@metrom-xyz/sdk";
import AptosCoreProvider from "./aptos-core-provider";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

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

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <AptosWalletAdapterProvider
                autoConnect={true}
                disableTelemetry={true}
                dappConfig={{
                    network:
                        ENVIRONMENT === Environment.Production
                            ? Network.MAINNET
                            : Network.TESTNET,
                    aptosApiKeys: {
                        mainnet: APTOS_CLIENT_API_KEY,
                        testnet: APTOS_CLIENT_TESTNET_API_KEY,
                    },
                }}
            >
                <AptosCoreProvider>
                    <ReownAppKitContextProvider>
                        <TokenIconsProvider>
                            <Fathom />
                            <Toaster />
                            {children}
                        </TokenIconsProvider>
                    </ReownAppKitContextProvider>
                </AptosCoreProvider>
            </AptosWalletAdapterProvider>
        </QueryClientProvider>
    );
}

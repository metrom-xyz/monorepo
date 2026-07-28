"use client";

import { type ReactNode } from "react";
import { TokenIconsProvider } from "./token-icon-provider";
import { Toaster } from "@metrom-xyz/ui";
import dynamic from "next/dynamic";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import {
    APTOS_CLIENT_API_KEY,
    APTOS_CLIENT_TESTNET_API_KEY,
    ENVIRONMENT,
} from "../commons/env";
import { ChainTypeProvider } from "../context/chain-type";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "wagmi/query";
import { Environment } from "@metrom-xyz/sdk";
import AptosCoreProvider from "../context/aptos-core-provider";
import { SolanaAdapterContextProvider } from "../context/solana-adapter";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "a few sec",
        m: "1m",
        mm: "%dm",
        h: "1hr",
        hh: "%dhr",
        d: "1d",
        dd: "%dd",
        M: "1mo",
        MM: "%dmo",
        y: "1y",
        yy: "%dy",
    },
});

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

const SuiDAppKitClientProvider = dynamic(
    () =>
        import("../context/sui-provider").then(
            (mod) => mod.SuiDAppKitClientProvider,
        ),
    { ssr: false },
);

// Dynamically imported (no SSR) because `@base-org/account` (used to build
// the EVM wallet connectors) pulls in `@coinbase/cdp-sdk`'s heavy Node
// dependency chain, which we don't need for basic wallet connection.
const EvmWalletProvider = dynamic(
    () =>
        import("../context/evm-wallet-provider").then((mod) => mod.EvmWalletProvider),
    { ssr: false },
);

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <ChainTypeProvider>
                <SuiDAppKitClientProvider>
                    <SolanaAdapterContextProvider>
                        <AptosWalletAdapterProvider
                            autoConnect={false}
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
                                <EvmWalletProvider>
                                    <TokenIconsProvider>
                                        <Toaster />
                                        {children}
                                    </TokenIconsProvider>
                                </EvmWalletProvider>
                            </AptosCoreProvider>
                        </AptosWalletAdapterProvider>
                    </SolanaAdapterContextProvider>
                </SuiDAppKitClientProvider>
            </ChainTypeProvider>
        </QueryClientProvider>
    );
}

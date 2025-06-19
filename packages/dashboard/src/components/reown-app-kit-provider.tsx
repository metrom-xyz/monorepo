"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    createAppKit,
    useAppKitTheme,
    type ThemeMode,
} from "@reown/appkit/react";
import React, { useEffect, type ReactNode } from "react";
import {
    cookieToInitialState,
    createConfig,
    http,
    WagmiProvider,
    type Config,
} from "wagmi";
import { safe } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "../commons";
import { hashFn } from "wagmi/query";
import { useTheme } from "next-themes";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { EIP1193RequestFn, Transport } from "viem";
import { base, mainnet } from "viem/chains";
import { WALLETCONNECT_PROJECT_ID } from "@/commons/env";

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

const transports = SUPPORTED_CHAINS.reduce(
    (prev, chain) => {
        prev[chain.id] = http(chain.rpcUrls.default.http[0]);
        return prev;
    },
    {} as Record<
        number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Transport<string, Record<string, any>, EIP1193RequestFn>
    >,
);

const wagmiAdapter = new WagmiAdapter({
    ssr: true,
    projectId: WALLETCONNECT_PROJECT_ID,
    networks: SUPPORTED_CHAINS,
    // FIXME: override base rpc due to 429 errors
    transports: { ...transports, [base.id]: http("https://base.llamarpc.com") },
    connectors: [safe()],
});

// Required for ENS resolution hooks, since the dapp doesn't support mainnet,
// we provide a separate client config specifically for querying ens on mainnet.
export const mainnetWagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    },
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
    allWallets: "SHOW",
    // https://docs.reown.com/cloud/wallets/wallet-list#wallets
    // excludeWalletIds: SAFE
    //     ? [
    //           // coinbase
    //           "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
    //           // metamask
    //           "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    //       ]
    //     : undefined,
    // featuredWalletIds: SAFE
    //     ? undefined
    //     : [
    //           // coinbase
    //           "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
    //           // metamask
    //           "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    //       ],
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

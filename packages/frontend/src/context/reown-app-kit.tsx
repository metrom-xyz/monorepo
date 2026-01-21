"use client";

import {
    createAppKit,
    useAppKitTheme,
    type ThemeMode,
} from "@reown/appkit/react";
import React, { useEffect, type ReactNode } from "react";
import { cookieToInitialState, createConfig, http, WagmiProvider } from "wagmi";
import { safe } from "wagmi/connectors";
import { SUPPORTED_CHAINS_EVM } from "../commons";
import { WALLETCONNECT_PROJECT_ID, SAFE } from "../commons/env";
import { useTheme } from "next-themes";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { EIP1193RequestFn, Transport } from "viem";
import { mainnet } from "viem/chains";

const transports = SUPPORTED_CHAINS_EVM.reduce(
    (prev, chain) => {
        prev[chain.id] = http(chain.rpcUrls.default.http[0], {
            batch: true,
            retryDelay: 500,
        });
        return prev;
    },
    {} as Record<
        number,
        Transport<string, Record<string, unknown>, EIP1193RequestFn>
    >,
);

const wagmiAdapter = new WagmiAdapter({
    ssr: true,
    projectId: WALLETCONNECT_PROJECT_ID,
    networks: SUPPORTED_CHAINS_EVM,
    // TODO: override base default RPC? It's rate limited https://docs.base.org/base-chain/quickstart/connecting-to-base#base-mainnet
    transports,
    connectors: SAFE ? [safe()] : undefined,
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
    networks: SUPPORTED_CHAINS_EVM,
    metadata: {
        name: "Metrom",
        description: "Flexible liquidity mining platform",
        url: "https://app.metrom.xyz",
        icons: ["https://app.metrom.xyz/icons/icon-128x128.png"],
    },
    allWallets: SAFE ? "SHOW" : "HIDE",
    // https://docs.reown.com/cloud/wallets/wallet-list#wallets
    excludeWalletIds: SAFE
        ? [
              // coinbase
              "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
              // metamask
              "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          ]
        : undefined,
    featuredWalletIds: SAFE
        ? undefined
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
            config={wagmiAdapter.wagmiConfig}
            initialState={initialState}
        >
            {children}
        </WagmiProvider>
    );
}

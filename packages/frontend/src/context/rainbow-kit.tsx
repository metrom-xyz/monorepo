"use client";

import { useMemo, type ReactNode } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { safe } from "wagmi/connectors";
import {
    connectorsForWallets,
    darkTheme,
    lightTheme,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
    base,
    frameWallet,
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useTheme } from "next-themes";
import { SUPPORTED_CHAINS_EVM } from "../commons";
import { WALLETCONNECT_PROJECT_ID, SAFE } from "../commons/env";
import type { EIP1193RequestFn, Transport } from "viem";
import { mainnet } from "viem/chains";

const FONT = "IBM Plex Sans, ui-sans-serif, sans-serif";

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

const EVM_WALLETS = [
    frameWallet,
    metaMaskWallet,
    base,
    walletConnectWallet,
    injectedWallet,
];

export const EVM_WALLETS_IDS = EVM_WALLETS.map(
    (wallet) => wallet.name.split("Wallet")[0],
);

// In SAFE (iframe) mode the app only ever connects through the Safe
// connector and WALLETCONNECT_PROJECT_ID may be unset, in which case
// connectorsForWallets would throw while building the walletConnect
// based connectors.
const connectors = SAFE
    ? [safe()]
    : connectorsForWallets(
          [
              {
                  groupName: "Popular",
                  wallets: EVM_WALLETS,
              },
          ],
          {
              projectId: WALLETCONNECT_PROJECT_ID,
              appName: "Metrom",
              appDescription: "Flexible liquidity mining platform",
              appUrl: "https://app.metrom.xyz",
              appIcon: "https://app.metrom.xyz/icons/icon-128x128.png",
          },
      );

export const wagmiConfig = createConfig({
    chains: SUPPORTED_CHAINS_EVM,
    // TODO: override base default RPC? It's rate limited https://docs.base.org/base-chain/quickstart/connecting-to-base#base-mainnet
    transports,
    connectors,
});

// Required for ENS resolution hooks, since the dapp doesn't support mainnet,
// we provide a separate client config specifically for querying ens on mainnet.
export const mainnetWagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    },
});

export function RainbowKitContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { resolvedTheme } = useTheme();

    const theme = useMemo(() => {
        const theme = resolvedTheme === "dark" ? darkTheme() : lightTheme();
        theme.fonts.body = FONT;
        return theme;
    }, [resolvedTheme]);

    return (
        <WagmiProvider config={wagmiConfig}>
            <RainbowKitProvider
                theme={theme}
                locale="en"
                appInfo={{ appName: "Metrom" }}
            >
                {children}
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

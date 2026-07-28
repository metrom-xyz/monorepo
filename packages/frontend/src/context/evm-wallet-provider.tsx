"use client";

import { type ReactNode } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
    baseAccount,
    injected,
    metaMask,
    safe,
    walletConnect,
} from "wagmi/connectors";
import { SUPPORTED_CHAINS_EVM } from "../commons";
import { WALLETCONNECT_PROJECT_ID, SAFE } from "../commons/env";
import type { EIP1193RequestFn, Transport } from "viem";
import { mainnet, swellchain } from "viem/chains";
import { MAINNET_RPC } from "../wagmi/mainnet-wagmi-config";

const APP_NAME = "Metrom";
const APP_DESCRIPTION = "Flexible liquidity mining platform";
const APP_URL = "https://app.metrom.xyz";
const APP_ICON = "https://app.metrom.xyz/icons/icon-128x128.png";

const SWELL_RPC = "https://rpc.ankr.com/swell";

const OVERRIDE_TRANSPORTS: Record<number, string> = {
    [mainnet.id]: MAINNET_RPC,
    [swellchain.id]: SWELL_RPC,
};

const transports = SUPPORTED_CHAINS_EVM.reduce(
    (prev, chain) => {
        prev[chain.id] = http(
            OVERRIDE_TRANSPORTS[chain.id] || chain.rpcUrls.default.http[0],
            {
                batch: true,
                retryDelay: 500,
            },
        );
        return prev;
    },
    {} as Record<
        number,
        Transport<string, Record<string, unknown>, EIP1193RequestFn>
    >,
);

// In SAFE (iframe) mode the app only ever connects through the Safe connector
// and WALLETCONNECT_PROJECT_ID may be unset, so the other connectors (which
// would throw building the WalletConnect one) must not be constructed.
const connectors = SAFE
    ? [safe()]
    : [
          injected({ target: "frame" }),
          metaMask({
              dappMetadata: {
                  name: APP_NAME,
                  url: APP_URL,
                  iconUrl: APP_ICON,
              },
          }),
          baseAccount({
              appName: APP_NAME,
              appLogoUrl: APP_ICON,
              preference: { telemetry: false },
          }),
          walletConnect({
              projectId: WALLETCONNECT_PROJECT_ID,
              metadata: {
                  name: APP_NAME,
                  description: APP_DESCRIPTION,
                  url: APP_URL,
                  icons: [APP_ICON],
              },
          }),
          injected(),
      ];

// Ids of the connectors above, in display order, used to drive the EVM
// wallet picker UI.
export const EVM_CONNECTOR_IDS = SAFE
    ? []
    : ["frame", "metaMaskSDK", "baseAccount", "walletConnect", "injected"];

export const wagmiConfig = createConfig({
    chains: SUPPORTED_CHAINS_EVM,
    transports,
    connectors,
    ssr: true,
});

export function EvmWalletProvider({ children }: { children: ReactNode }) {
    return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}

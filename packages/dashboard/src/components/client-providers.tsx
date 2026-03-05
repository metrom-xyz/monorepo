"use client";

import { APTOS_CLIENT_API_KEY } from "@/commons/env";
import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Toaster } from "@metrom-xyz/ui";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { type ReactNode } from "react";
import AptosCoreProvider from "./aptos-core-provider";
import { ReownAppKitContextProvider } from "./reown-app-kit-provider";
import { TokenIconsProvider } from "./token-icon-provider";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export function ClientProviders({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
            disableTelemetry={true}
            dappConfig={{
                network: Network.MAINNET,
                aptosApiKeys: {
                    mainnet: APTOS_CLIENT_API_KEY,
                },
            }}
        >
            <AptosCoreProvider>
                <ReownAppKitContextProvider>
                    <TokenIconsProvider>
                        <Toaster />
                        {children}
                    </TokenIconsProvider>
                </ReownAppKitContextProvider>
            </AptosCoreProvider>
        </AptosWalletAdapterProvider>
    );
}

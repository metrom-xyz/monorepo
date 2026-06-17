"use client";

import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { dAppKit } from "./sui-dapp-kit";

export function SuiDAppKitClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}

export { ConnectButton };
